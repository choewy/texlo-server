import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';

import { Queue } from 'bullmq';

import { VoiceProvider } from '@apps/api/shared';

import { UnsupportedVoiceProviderException } from '../exceptions';
import { VoiceGenerateJob } from '../jobs';

import { VoiceGenerateQueueProducer } from './voice-generate-queue.producer';

@Injectable()
export class BullVoiceGenerateQueueProducer implements VoiceGenerateQueueProducer {
  private readonly queues: Queue<VoiceGenerateJob>[];

  constructor(
    @InjectQueue('voice-generate.typecast')
    typecastVoiceGenerateQueue: Queue<VoiceGenerateJob>,
    @InjectQueue('voice-generate.supertone')
    supertoneVoiceGenerateQueue: Queue<VoiceGenerateJob>,
  ) {
    this.queues = [typecastVoiceGenerateQueue, supertoneVoiceGenerateQueue];
  }

  private find(provider: VoiceProvider): Queue<VoiceGenerateJob> {
    const queue = this.queues.find((queue) => queue.name === `voice-generate.${provider}`);

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
