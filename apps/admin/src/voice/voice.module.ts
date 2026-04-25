import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { BullVoiceSyncQueueProducer, VOICE_SYNC_QUEUE_PRODUCER } from './producer';
import { TypeOrmVoiceSyncLockRepository, VOICE_SYNC_LOCK_REPOSITORY } from './repositories';
import { VoiceController } from './voice.controller';
import { VoiceService } from './voice.service';

@Module({
  imports: [BullModule.registerQueue({ name: 'voice-sync.typecast' }), BullModule.registerQueue({ name: 'voice-sync.supertone' })],
  controllers: [VoiceController],
  providers: [
    VoiceService,
    {
      provide: VOICE_SYNC_LOCK_REPOSITORY,
      useClass: TypeOrmVoiceSyncLockRepository,
    },
    {
      provide: VOICE_SYNC_QUEUE_PRODUCER,
      useClass: BullVoiceSyncQueueProducer,
    },
  ],
})
export class VoiceModule {}
