import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, OnModuleInit } from '@nestjs/common';

import { existsSync, mkdirSync, readFileSync, unlinkSync } from 'node:fs';
import { YtDlp } from '@choewy/yt-dlp';
import { AxiosError } from 'axios';

import { STORAGE_CLIENT, type StorageClient } from '@libs/integrations';

import { VideoDownloadStatus } from '../domain';
import { type VideoDownloadJob } from '../jobs';
import { VIDEO_DOWNLOAD_REPOSITORY, type VideoDownloadRepository } from '../repositories';

@Processor('video-download.youtube')
export class YoutubeVideoDownloadProcessor extends WorkerHost implements OnModuleInit {
  private readonly TEMP_DIR = '.temp';

  constructor(
    @Inject(STORAGE_CLIENT)
    private readonly storageClient: StorageClient,
    @Inject(VIDEO_DOWNLOAD_REPOSITORY)
    private readonly videoDownloadRepository: VideoDownloadRepository,
  ) {
    super();
  }

  onModuleInit() {
    if (!existsSync(this.TEMP_DIR)) {
      mkdirSync(this.TEMP_DIR, { recursive: true });
    }
  }

  private unlink(path: string): void {
    if (existsSync(path)) {
      unlinkSync(path);
    }
  }

  async process(job: VideoDownloadJob): Promise<void> {
    const videoDownload = await this.videoDownloadRepository.findOneById(job.data.id);

    if (!videoDownload) {
      return;
    }

    await this.videoDownloadRepository.update(videoDownload.id, { status: VideoDownloadStatus.InProgress });

    const path = `${this.TEMP_DIR}/${videoDownload.id}.mp4`;

    try {
      await new YtDlp().url(videoDownload.origin).output(path).mergeFormat('mp4').exec({ debug: true });
      const { url } = await this.storageClient.uploadBuffer(Buffer.from(readFileSync(path).buffer));
      await this.videoDownloadRepository.update(videoDownload.id, { url, status: VideoDownloadStatus.Completed });
    } finally {
      this.unlink(path);
    }
  }

  @OnWorkerEvent('completed')
  async onCompleted(job: VideoDownloadJob): Promise<void> {
    await this.videoDownloadRepository.update(job.data.id, { status: VideoDownloadStatus.Completed });
  }

  @OnWorkerEvent('failed')
  async onFailed(job: VideoDownloadJob | undefined, e: Error | AxiosError): Promise<void> {
    if (!job) {
      return;
    }

    let error: object;

    switch (true) {
      case e instanceof AxiosError:
        error = {
          name: e.name,
          message: e.message,
          status: e.response?.status,
          data: e.response?.data as unknown,
        };

        break;

      case e instanceof Error:
        error = {
          name: e.name,
          message: e.message,
          stack: e.stack,
          cause: e.cause,
        };

        break;

      case typeof e === 'object':
        error = e;
        break;

      default:
        error = { error: e };
    }

    await this.videoDownloadRepository.update(job.data.id, { error, status: VideoDownloadStatus.Failed });
  }
}
