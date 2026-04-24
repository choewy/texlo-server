import { InjectQueue } from '@nestjs/bullmq';
import { Inject, Injectable } from '@nestjs/common';

import { Queue } from 'bullmq';

import { ActiveVoiceSyncAlreadyExistsException } from './exceptions';
import { VOICE_SYNC_LOCK_REPOSITORY, type VoiceSyncLockRepository } from './repositories';
import { SyncVoicesInput, SyncVoicesResult } from './usecases';

@Injectable()
export class VoiceService {
  constructor(
    @Inject(VOICE_SYNC_LOCK_REPOSITORY)
    private readonly voiceSyncLockRepository: VoiceSyncLockRepository,
    @InjectQueue('voice-sync')
    private readonly voiceSyncQueue: Queue,
  ) {}

  async syncVoices(input: SyncVoicesInput): Promise<SyncVoicesResult> {
    const has = await this.voiceSyncLockRepository.hasActivated(input.provider);

    if (has) {
      throw new ActiveVoiceSyncAlreadyExistsException();
    }

    const { id } = await this.voiceSyncLockRepository.insert({ adminId: input.adminId, provider: input.provider });

    try {
      await this.voiceSyncQueue.add(
        input.provider,
        { id },
        {
          jobId: id,
          attempts: 3,
          backoff: { type: 'exponential', delay: 1_000 },
          removeOnFail: { age: 60 * 60 * 24 * 7, count: 1_000 },
          removeOnComplete: true,
        },
      );
    } catch (e) {
      await this.voiceSyncLockRepository.deleteById(id);
      throw e;
    }

    return { id };
  }
}
