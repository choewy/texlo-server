import { Injectable, Optional } from '@nestjs/common';

import { DataSource, EntityManager, Repository } from 'typeorm';

import { VoiceEntity } from '@libs/persistence';

import { Voice, VoiceProvider } from '../domain';
import { VoiceMapper } from '../mappers';

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

  async findUrls(provider: VoiceProvider, code: string): Promise<Voice | null> {
    const voice = await this.repository.findOneBy({ provider, code });

    return voice ? VoiceMapper.toVoiceUrls(voice) : null;
  }

  async upsert(voice: Voice): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .insert()
      .into('voices')
      .values(voice)
      .orUpdate(['name', 'image_url', 'sound_url', 'gender', 'age', 'languages', 'models', 'styles', 'usecases'], ['provider', 'code'], {
        skipUpdateIfNoValuesChanged: true,
      })
      .execute();
  }
}
