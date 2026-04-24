import { Injectable, Optional } from '@nestjs/common';

import { DataSource, EntityManager, In, Repository } from 'typeorm';

import { VoiceSyncLockEntity, VoiceSyncLockStatus } from '@libs/persistence';

import { VoiceProvider } from '@apps/admin/shared';

import { VoiceSyncLock } from '../domain';
import { VoiceSyncLockMapper } from '../mappers';

import { VoiceSyncLockRepository } from './voice-sync-lock.repository';

@Injectable()
export class TypeOrmVoiceSyncLockRepository implements VoiceSyncLockRepository {
  private readonly repository: Repository<VoiceSyncLockEntity>;

  constructor(
    private readonly dataSource: DataSource,
    @Optional()
    private readonly em?: EntityManager,
  ) {
    this.repository = (this.em ?? this.dataSource).getRepository(VoiceSyncLockEntity);
  }

  async hasActivated(provider: VoiceProvider) {
    return this.repository.existsBy({
      provider,
      status: In([VoiceSyncLockStatus.Pending, VoiceSyncLockStatus.InProgress]),
    });
  }

  async insert(params: Pick<VoiceSyncLock, 'provider' | 'adminId'>): Promise<VoiceSyncLock> {
    const voiceSyncLock = this.repository.create({
      provider: params.provider,
      adminId: params.adminId,
      status: VoiceSyncLockStatus.Pending,
    });

    return VoiceSyncLockMapper.toVoiceSyncLock(await this.repository.save(voiceSyncLock));
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete({ id });
  }
}
