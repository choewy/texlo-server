import { Injectable } from '@nestjs/common';

import { DataSource, EntityManager } from 'typeorm';

import { VoiceEntity } from '@libs/persistence';

import { Voice } from '../domain/voice';
import { VoiceMapper } from '../mappers';

import { GetVoiceParams, VoiceRepository } from './voice.repository';

@Injectable()
export class TypeOrmVoiceRepository implements VoiceRepository {
  constructor(private readonly dataSource: DataSource) {}

  private getRepository(em?: EntityManager) {
    return (em ?? this.dataSource).getRepository(VoiceEntity);
  }

  async find(params: GetVoiceParams): Promise<[Voice[], number]> {
    const qb = this.getRepository()
      .createQueryBuilder('voice')
      .skip((params.page - 1) * params.take)
      .take(params.take)
      .where('1 = 1')
      .orderBy('voice.createdAt', 'ASC')
      .addOrderBy('voice.id', 'ASC');

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
