import { Injectable, Optional } from '@nestjs/common';

import { DataSource, EntityManager, Repository } from 'typeorm';

import { VoiceGenerateEntity } from '@libs/persistence';

import { VoiceGenerate } from '../domain';
import { VoiceMapper } from '../mappers';

import { VoiceGenerateRepository } from './voice-generate.repository';

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

  async insert(params: Pick<VoiceGenerate, 'text' | 'voiceId' | 'userId'>): Promise<VoiceGenerate> {
    const voiceGenerate = this.repository.create({
      text: params.text,
      voiceId: params.voiceId,
      userId: params.userId,
    });

    return VoiceMapper.toVoiceGenerate(await this.repository.save(voiceGenerate));
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
