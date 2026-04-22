import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { VoiceService } from './voice.service';

@ApiTags('목소리')
@Controller('voices')
export class VoiceController {
  constructor(private readonly voiceService: VoiceService) {}
}
