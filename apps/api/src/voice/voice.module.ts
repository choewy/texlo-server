import { Module } from '@nestjs/common';

import { TypeOrmVoiceRepository, VOICE_REPOSITORY } from './repositories';
import { VoiceController } from './voice.controller';
import { VoiceService } from './voice.service';

@Module({
  controllers: [VoiceController],
  providers: [
    VoiceService,
    {
      provide: VOICE_REPOSITORY,
      useClass: TypeOrmVoiceRepository,
    },
  ],
})
export class VoiceModule {}
