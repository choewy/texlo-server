import { Injectable, Optional } from '@nestjs/common';

import { DataSource, EntityManager, Repository } from 'typeorm';

import { VoiceSyncLockEntity } from '@libs/persistence';

import { VoiceSyncLockStatus } from '../domain';

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

  async update(id: string, status: VoiceSyncLockStatus, error?: object): Promise<void> {
    await this.repository.update(id, { status, error, updatedAt: () => 'NOW()' });
  }
}
