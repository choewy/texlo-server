import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';

import { Queue } from 'bullmq';

import { VoiceProvider } from '@apps/admin/shared';

import { UnsupportedVoiceProviderException } from '../exceptions';
import { VoiceSyncJob } from '../jobs';

import { VoiceSyncQueueProducer } from './voice-sync-queue.producer';

@Injectable()
export class BullVoiceSyncQueueProducer implements VoiceSyncQueueProducer {
  private readonly queues: Queue<VoiceSyncJob>[];

  constructor(
    @InjectQueue('voice-sync.typecast')
    typecastSyncQueue: Queue<VoiceSyncJob>,
    @InjectQueue('voice-sync.supertone')
    supertoneSyncQueue: Queue<VoiceSyncJob>,
  ) {
    this.queues = [typecastSyncQueue, supertoneSyncQueue];
  }

  private find(provider: VoiceProvider): Queue<VoiceSyncJob> {
    const queue = this.queues.find((queue) => queue.name === `voice-sync.${provider}`);

    if (!queue) {
      throw new UnsupportedVoiceProviderException();
    }

    return queue;
  }

  async add(provider: VoiceProvider, jobId: string): Promise<void> {
    await this.find(provider).add(
      provider,
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
