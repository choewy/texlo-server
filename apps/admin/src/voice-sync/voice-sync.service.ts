import { Inject, Injectable } from '@nestjs/common';

import { ActiveVoiceSyncAlreadyExistsException } from './exceptions';
import { VOICE_SYNC_QUEUE_PRODUCER, type VoiceSyncQueueProducer } from './producer';
import { VOICE_SYNC_LOCK_REPOSITORY, type VoiceSyncLockRepository } from './repositories';
import { GetVoiceSyncLocksInput, GetVoiceSyncLocksResult, SyncVoicesInput, SyncVoicesResult } from './usecases';

@Injectable()
export class VoiceSyncService {
  constructor(
    @Inject(VOICE_SYNC_LOCK_REPOSITORY)
    private readonly voiceSyncLockRepository: VoiceSyncLockRepository,
    @Inject(VOICE_SYNC_QUEUE_PRODUCER)
    private readonly voiceSyncQueueProducer: VoiceSyncQueueProducer,
  ) {}

  async getVoiceSyncLocks(input: GetVoiceSyncLocksInput): Promise<GetVoiceSyncLocksResult> {
    const [rows, total] = await this.voiceSyncLockRepository.find(input);

    return { rows, total };
  }

  async syncVoices(input: SyncVoicesInput): Promise<SyncVoicesResult> {
    const has = await this.voiceSyncLockRepository.hasActivated(input.provider);

    if (has) {
      throw new ActiveVoiceSyncAlreadyExistsException();
    }

    const { id } = await this.voiceSyncLockRepository.insert({ adminId: input.adminId, provider: input.provider });

    try {
      await this.voiceSyncQueueProducer.add(input.provider, id);
    } catch (e) {
      await this.voiceSyncLockRepository.deleteById(id);
      throw e;
    }

    return { id };
  }
}
