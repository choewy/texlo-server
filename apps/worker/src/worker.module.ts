import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WinstonModule } from 'nest-winston';

import {
  BULL_MQ_CONFIG,
  bullMqConfig,
  REDIS_CONFIG,
  redisConfig,
  STORAGE_CLIENT_CONFIG,
  storageClientConfig,
  typecastConfig,
  TYPEORM_CONFIG,
  typeormConfig,
  WINSTON_CONFIG,
  winstonConfig,
} from '@libs/config';
import { StorageModule } from '@libs/integrations';
import { RedisModule } from '@libs/redis';

import { VoiceSyncModule } from './voice-sync/voice-sync.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['apps/worker/.env', '.env'],
      load: [winstonConfig, typeormConfig, redisConfig, bullMqConfig, storageClientConfig, typecastConfig],
    }),
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return configService.getOrThrow(WINSTON_CONFIG);
      },
    }),
    RedisModule.forRootAsync({
      publisher: true,
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return configService.getOrThrow(REDIS_CONFIG);
      },
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return configService.getOrThrow(BULL_MQ_CONFIG);
      },
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return configService.getOrThrow(TYPEORM_CONFIG);
      },
    }),
    StorageModule.forRootAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return configService.getOrThrow(STORAGE_CLIENT_CONFIG);
      },
    }),
    VoiceSyncModule,
  ],
})
export class WorkerModule {}
