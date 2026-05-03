import { Inject, Injectable } from '@nestjs/common';

import { VIDEO_DOWNLOAD_QUEUE_PRODUCER, type VideoDownloadQueueProducer } from './producer';
import { VIDEO_DOWNLOAD_REPOSITORY, type VideoDownloadRepository } from './repositories';
import { DownloadVideoInput, DownloadVideoResult, GetVideoDownloadsInput, GetVideoDownloadsResult } from './usecases';

@Injectable()
export class VideoDownloadService {
  constructor(
    @Inject(VIDEO_DOWNLOAD_REPOSITORY)
    private readonly videoDownloadRepository: VideoDownloadRepository,
    @Inject(VIDEO_DOWNLOAD_QUEUE_PRODUCER)
    private readonly videoDownloadQueueProducer: VideoDownloadQueueProducer,
  ) {}

  async getVideoDownloads(input: GetVideoDownloadsInput): Promise<GetVideoDownloadsResult> {
    const [rows, total] = await this.videoDownloadRepository.find(input);

    return { rows, total };
  }

  async downloadVideo(input: DownloadVideoInput): Promise<DownloadVideoResult> {
    const { id } = await this.videoDownloadRepository.insert({
      platform: input.platform,
      origin: input.origin,
      userId: input.userId,
    });

    try {
      await this.videoDownloadQueueProducer.add(input.platform, id);
    } catch (e) {
      await this.videoDownloadRepository.deleteById(id);
      throw e;
    }

    return { id };
  }
}
