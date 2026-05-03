import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { BullVoiceGenerateQueueProducer, VOICE_GENERATE_QUEUE_PRODUCER } from './producer';
import { TypeOrmVoiceGenerateRepository, TypeOrmVoiceRepository, VOICE_GENERATE_REPOSITORY, VOICE_REPOSITORY } from './repositories';
import { VoiceController } from './voice.controller';
import { VoiceService } from './voice.service';

@Module({
  imports: [BullModule.registerQueue({ name: 'voice-generate.typecast' }), BullModule.registerQueue({ name: 'voice-generate.supertone' })],
  controllers: [VoiceController],
  providers: [
    VoiceService,
    {
      provide: VOICE_REPOSITORY,
      useClass: TypeOrmVoiceRepository,
    },
    {
      provide: VOICE_GENERATE_REPOSITORY,
      useClass: TypeOrmVoiceGenerateRepository,
    },
    {
      provide: VOICE_GENERATE_QUEUE_PRODUCER,
      useClass: BullVoiceGenerateQueueProducer,
    },
  ],
})
export class VoiceModule {}
