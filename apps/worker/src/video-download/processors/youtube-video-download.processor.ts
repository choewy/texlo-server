import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';

import { YtDlp } from '@choewy/yt-dlp';
import { AxiosError } from 'axios';

import { STORAGE_CLIENT, type StorageClient } from '@libs/integrations';

import { VideoDownloadStatus } from '../domain';
import { type VideoDownloadJob, VideoDownloadJobReturnValue } from '../jobs';
import { VIDEO_DOWNLOAD_REPOSITORY, type VideoDownloadRepository } from '../repositories';

@Processor('video-download.youtube', { concurrency: 2 })
export class YoutubeVideoDownloadProcessor extends WorkerHost {
  constructor(
    @Inject(STORAGE_CLIENT)
    private readonly storageClient: StorageClient,
    @Inject(VIDEO_DOWNLOAD_REPOSITORY)
    private readonly videoDownloadRepository: VideoDownloadRepository,
  ) {
    super();
  }

  async process(job: VideoDownloadJob): Promise<VideoDownloadJobReturnValue | null> {
    const videoDownload = await this.videoDownloadRepository.findOneById(job.data.id);

    if (!videoDownload) {
      return null;
    }

    await this.videoDownloadRepository.update(videoDownload.id, { status: VideoDownloadStatus.InProgress });
    const { stream, title } = await new YtDlp().url(videoDownload.origin).mergeFormat('mp4').toStream({ debug: true });
    const { url, size } = await this.storageClient.uploadStream(stream);

    return { title, url, size };
  }

  @OnWorkerEvent('completed')
  async onCompleted(job: VideoDownloadJob): Promise<void> {
    const id = job.data.id;
    const returnvalue = job.returnvalue;

    if (returnvalue) {
      await this.videoDownloadRepository.update(id, { ...returnvalue, status: VideoDownloadStatus.Completed });
    } else {
      await this.videoDownloadRepository.update(id, { status: VideoDownloadStatus.Completed });
    }
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
