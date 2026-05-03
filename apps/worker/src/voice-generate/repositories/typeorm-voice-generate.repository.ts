import { Injectable, Optional } from '@nestjs/common';

import { DataSource, EntityManager, Repository } from 'typeorm';

import { VoiceGenerateEntity } from '@libs/persistence';

import { VoiceGenerate } from '../domain';
import { VoiceMapper } from '../mappers';

import { VoiceGenerateRepository, VoiceGenerateUpdateParams } from './voice-generate.repository';

@Injectable()
export class TypeOrmVoiceGenerateRepository implements VoiceGenerateRepository {
  private readonly repository: Repository<VoiceGenerateEntity>;

  constructor(
    dataSource: DataSource,
    @Optional()
    em?: EntityManager,
  ) {
    this.repository = (em ?? dataSource).getRepository(VoiceGenerateEntity);
  }

  async findOneById(id: string): Promise<VoiceGenerate | null> {
    const voiceGenerate = await this.repository.findOne({
      relations: { voice: true },
      where: { id },
    });

    return voiceGenerate ? VoiceMapper.toVoiceGenerate(voiceGenerate) : null;
  }

  async update(id: string, params: VoiceGenerateUpdateParams): Promise<void> {
    await this.repository.update(id, {
      status: params.status,
      url: params.url,
      size: params.size,
      error: params.error,
      updatedAt: () => 'NOW()',
    });
  }
}
