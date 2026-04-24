import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { TypeOrmVoiceSyncLockRepository, VOICE_SYNC_LOCK_REPOSITORY } from './repositories';
import { VoiceController } from './voice.controller';
import { VoiceService } from './voice.service';

@Module({
  imports: [BullModule.registerQueue({ name: 'voice-sync' })],
  controllers: [VoiceController],
  providers: [
    VoiceService,
    {
      provide: VOICE_SYNC_LOCK_REPOSITORY,
      useClass: TypeOrmVoiceSyncLockRepository,
    },
  ],
})
export class VoiceModule {}
