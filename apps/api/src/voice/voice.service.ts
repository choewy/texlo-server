import { Inject, Injectable } from '@nestjs/common';

import { VoiceGenerate } from './domain';
import { NotFoundVoiceException, NotFoundVoiceGenerateException } from './exceptions';
import { VOICE_GENERATE_QUEUE_PRODUCER, type VoiceGenerateQueueProducer } from './producer';
import { VOICE_GENERATE_REPOSITORY, VOICE_REPOSITORY, type VoiceGenerateRepository, type VoiceRepository } from './repositories';
import { GenerateVoiceInput, GenerateVoiceResult, GetVoicesInput, GetVoicesResult } from './usecases';

@Injectable()
export class VoiceService {
  constructor(
    @Inject(VOICE_REPOSITORY)
    private readonly voiceRepository: VoiceRepository,
    @Inject(VOICE_GENERATE_REPOSITORY)
    private readonly voiceGenerateRepository: VoiceGenerateRepository,
    @Inject(VOICE_GENERATE_QUEUE_PRODUCER)
    private readonly voiceGenerateQueueProducer: VoiceGenerateQueueProducer,
  ) {}

  async getVoices(input: GetVoicesInput, userId?: string): Promise<GetVoicesResult> {
    const [rows, total] = await this.voiceRepository.find({ ...input, userId });

    return { total, rows };
  }

  async generateVoice(input: GenerateVoiceInput, userId: string): Promise<GenerateVoiceResult> {
    const voice = await this.voiceRepository.findOneById(input.voiceId);

    if (!voice) {
      throw new NotFoundVoiceException();
    }

    const { id } = await this.voiceGenerateRepository.insert({
      userId,
      text: input.text,
      voiceId: input.voiceId,
    });

    try {
      await this.voiceGenerateQueueProducer.add(voice.provider, id);
      return { id };
    } catch (e) {
      await this.voiceGenerateRepository.deleteById(id);
      throw e;
    }
  }

  async getVoiceGenerate(id: string): Promise<VoiceGenerate> {
    const voiceGenerate = await this.voiceGenerateRepository.findOneById(id);

    if (!voiceGenerate) {
      throw new NotFoundVoiceGenerateException();
    }

    return voiceGenerate;
  }
}
