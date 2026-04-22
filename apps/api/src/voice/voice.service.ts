import { Inject, Injectable } from '@nestjs/common';

import { VOICE_REPOSITORY, type VoiceRepository } from './repositories';

@Injectable()
export class VoiceService {
  constructor(
    @Inject(VOICE_REPOSITORY)
    private readonly voiceRepository: VoiceRepository,
  ) {}
}
