import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SUPERTONE_CONFIG, TYPECAST_CONFIG } from '@libs/config';
import { SupertoneModule, TypecastModule } from '@libs/integrations';

import { TypeOrmVoiceRepository, TypeOrmVoiceSyncLockRepository, VOICE_REPOSITORY, VOICE_SYNC_LOCK_REPOSITORY } from './repositories';
import { SupertoneVoiceSyncProcessor } from './supertone-voice-sync.processor';
import { TypecastVoiceSyncProcessor } from './typecast-voice-sync.processor';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'voice-sync.typecast' }),
    BullModule.registerQueue({ name: 'voice-sync.supertone' }),
    TypecastModule.registerAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return configService.getOrThrow(TYPECAST_CONFIG);
      },
    }),
    SupertoneModule.registerAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return configService.getOrThrow(SUPERTONE_CONFIG);
      },
    }),
  ],
  providers: [
    TypecastVoiceSyncProcessor,
    SupertoneVoiceSyncProcessor,
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
