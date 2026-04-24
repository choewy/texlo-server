import { Injectable, Optional } from '@nestjs/common';

import { DataSource, EntityManager, Repository } from 'typeorm';

import { VoiceEntity } from '@libs/persistence';

import { Voice } from '../domain';

import { VoiceRepository } from './voice.repository';

@Injectable()
export class TypeOrmVoiceRepository implements VoiceRepository {
  private readonly repository: Repository<VoiceEntity>;

  constructor(
    private readonly dataSource: DataSource,
    @Optional()
    private readonly em?: EntityManager,
  ) {
    this.repository = (this.em ?? this.dataSource).getRepository(VoiceEntity);
  }

  async upserts(voices: Voice[]): Promise<void> {
    if (voices.length === 0) {
      return;
    }

    await this.repository
      .createQueryBuilder()
      .insert()
      .into(VoiceEntity)
      .values(voices)
      .orUpdate(['name', 'image_url', 'sound_url', 'gender', 'age', 'languages', 'models', 'styles', 'usecases'], ['provider', 'code'], {
        skipUpdateIfNoValuesChanged: true,
      })
      .execute();
  }
}
