import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { BullVoiceSyncQueueProducer, VOICE_SYNC_QUEUE_PRODUCER } from './producer';
import { TypeOrmVoiceSyncLockRepository, VOICE_SYNC_LOCK_REPOSITORY } from './repositories';
import { VoiceSyncController } from './voice-sync.controller';
import { VoiceSyncService } from './voice-sync.service';

@Module({
  imports: [BullModule.registerQueue({ name: 'voice-sync.typecast' }), BullModule.registerQueue({ name: 'voice-sync.supertone' })],
  controllers: [VoiceSyncController],
  providers: [
    VoiceSyncService,
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
export class VoiceSyncModule {}
