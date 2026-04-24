import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { TYPECAST_CONFIG } from '@libs/config';
import { TypecastModule } from '@libs/integrations';

import { TypeOrmVoiceRepository, TypeOrmVoiceSyncLockRepository, VOICE_REPOSITORY, VOICE_SYNC_LOCK_REPOSITORY } from './repositories';
import { VoiceSyncProcessor } from './voice-sync.processor';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'voice-sync' }),
    TypecastModule.registerAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return configService.getOrThrow(TYPECAST_CONFIG);
      },
    }),
  ],
  providers: [
    VoiceSyncProcessor,
    {
      provide: VOICE_SYNC_LOCK_REPOSITORY,
      useClass: TypeOrmVoiceSyncLockRepository,
    },
    {
      provide: VOICE_REPOSITORY,
      useClass: TypeOrmVoiceRepository,
    },
  ],
})
export class VoiceSyncModule {}
