import { Inject, Injectable } from '@nestjs/common';

import { VOICE_REPOSITORY, type VoiceRepository } from './repositories';
import { GetVoicesInput, GetVoicesResult } from './usecases';

@Injectable()
export class VoiceService {
  constructor(
    @Inject(VOICE_REPOSITORY)
    private readonly voiceRepository: VoiceRepository,
  ) {}

  async getVoices(input: GetVoicesInput): Promise<GetVoicesResult> {
    const [rows, total] = await this.voiceRepository.find(input);

    return { total, rows };
  }
}
