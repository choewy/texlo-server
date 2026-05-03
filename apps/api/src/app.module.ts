import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WinstonModule } from 'nest-winston';

import {
  BULL_MQ_CONFIG,
  bullMqConfig,
  cookieConfig,
  googleOAuthConfig,
  httpConfig,
  jwtConfig,
  jwtPassportConfig,
  REDIS_CONFIG,
  redisConfig,
  STORAGE_CLIENT_CONFIG,
  storageClientConfig,
  TYPEORM_CONFIG,
  typeormConfig,
  WINSTON_CONFIG,
  winstonConfig,
} from '@libs/config';
import { GlobalHttpExceptionFilter, GlobalValidationPipe } from '@libs/http';
import { StorageModule } from '@libs/integrations';
import { RedisModule } from '@libs/redis';

import { AuthModule } from './auth/auth.module';
import { ContextModule } from './common';
import { OAuthModule } from './oauth/oauth.module';
import { UserModule } from './user/user.module';
import { VideoDownloadModule } from './video-download/video-download.module';
import { VoiceModule } from './voice/voice.module';

@Module({
  imports: [
    ContextModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['apps/api/.env', '.env'],
      load: [httpConfig, cookieConfig, jwtConfig, jwtPassportConfig, winstonConfig, typeormConfig, redisConfig, bullMqConfig, storageClientConfig, googleOAuthConfig],
    }),
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return configService.getOrThrow(WINSTON_CONFIG);
      },
    }),
    RedisModule.forRootAsync({
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
    AuthModule,
    OAuthModule,
    UserModule,
    VoiceModule,
    VideoDownloadModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: GlobalValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalHttpExceptionFilter,
    },
  ],
})
export class AppModule {}
