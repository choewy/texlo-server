import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';

import { Queue } from 'bullmq';

import { VideoDownloadPlatform } from '@apps/api/shared';

import { UnsupportedVideoDownloadPlatformException } from '../exceptions';
import { VideoDownloadJob } from '../jobs';

import { VideoDownloadQueueProducer } from './video-download-queue.producer';

@Injectable()
export class BullVideoDownloadQueueProducer implements VideoDownloadQueueProducer {
  private readonly queues: Queue<VideoDownloadJob>[];

  constructor(
    @InjectQueue('video-download.youtube')
    youtubeVideoDownloadQueue: Queue<VideoDownloadJob>,
  ) {
    this.queues = [youtubeVideoDownloadQueue];
  }

  private find(platform: VideoDownloadPlatform): Queue<VideoDownloadJob> {
    const queue = this.queues.find((queue) => queue.name === `video-download.${platform}`);

    if (!queue) {
      throw new UnsupportedVideoDownloadPlatformException();
    }

    return queue;
  }

  async add(platform: VideoDownloadPlatform, jobId: string): Promise<void> {
    await this.find(platform).add(
      platform,
      { id: jobId },
      {
        jobId,
        attempts: 3,
        backoff: { type: 'exponential', delay: 1_000 },
        removeOnFail: { age: 60 * 60 * 24 * 7, count: 1_000 },
        removeOnComplete: true,
      },
    );
  }
}
