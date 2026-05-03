import { Injectable, Optional } from '@nestjs/common';

import { DataSource, EntityManager, Repository } from 'typeorm';

import { VoiceEntity } from '@libs/persistence';

import { VoiceStatus } from '@apps/api/shared';

import { Voice } from '../domain/voice';
import { VoiceMapper } from '../mappers';

import { FindVoiceParams, VoiceRepository } from './voice.repository';

@Injectable()
export class TypeOrmVoiceRepository implements VoiceRepository {
  private readonly repository: Repository<VoiceEntity>;

  constructor(
    dataSource: DataSource,
    @Optional()
    em?: EntityManager,
  ) {
    this.repository = (em ?? dataSource).getRepository(VoiceEntity);
  }

  async findOneById(id: string): Promise<Voice | null> {
    const voice = await this.repository.findOneBy({ id });

    return voice ? VoiceMapper.toVoice(voice) : null;
  }

  async find(params: FindVoiceParams): Promise<[Voice[], number]> {
    const qb = this.repository
      .createQueryBuilder('voice')
      .skip((params.page - 1) * params.take)
      .take(params.take)
      .where('voice.status = :status', { status: VoiceStatus.Activated })
      .orderBy('voice.createdAt', 'ASC')
      .addOrderBy('voice.id', 'ASC');

    if (params.provider) {
      qb.andWhere('voice.provider = :provider', { provider: params.provider });
    }

    if (params.age) {
      qb.andWhere('voice.age = :age', { age: params.age });
    }

    if (params.gender) {
      qb.andWhere('voice.gender = :gender', { gender: params.gender });
    }

    if (params.language) {
      qb.andWhere(':language = ANY(voice.languages)', { language: params.language });
    }

    if (params.userId) {
      qb.leftJoinAndMapOne('voice.favorite', 'voice.favorite', 'favorite', 'favorite.userId = :userId AND favorite.voiceId = voice.id', {
        userId: params.userId,
      });

      if (params.favorite === 'true') {
        qb.andWhere('favorite.id IS NOT NULL');
      }

      if (params.favorite === 'false') {
        qb.andWhere('favorite.id IS NULL');
      }
    }

    const [rows, total] = await qb.getManyAndCount();

    return [rows.map((row) => VoiceMapper.toVoice(row)), total];
  }
}
