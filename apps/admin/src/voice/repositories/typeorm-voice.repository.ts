import { Injectable } from '@nestjs/common';

import { DataSource, EntityManager } from 'typeorm';

import { VoiceEntity } from '@libs/persistence';

import { VoiceStatus } from '@apps/admin/shared';

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

    const [rows, total] = await qb.getManyAndCount();

    return [rows.map((row) => VoiceMapper.toVoice(row)), total];
  }
}
