import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SUPERTONE_CONFIG, TYPECAST_CONFIG } from '@libs/config';
import { SupertoneModule, TypecastModule } from '@libs/integrations';

import { SupertoneVoiceGenerateProcessor, TypecastVoiceGenerateProcessor } from './processors';
import { TypeOrmVoiceGenerateRepository, VOICE_GENERATE_REPOSITORY } from './repositories';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'voice-generate.typecast' }),
    BullModule.registerQueue({ name: 'voice-generate.supertone' }),
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
    TypecastVoiceGenerateProcessor,
    SupertoneVoiceGenerateProcessor,
    {
      provide: VOICE_GENERATE_REPOSITORY,
      useClass: TypeOrmVoiceGenerateRepository,
    },
  ],
})
export class VoiceGenerateModule {}
