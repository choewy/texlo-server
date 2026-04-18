import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WinstonModule } from 'nest-winston';

import { cookieConfig, httpConfig, jwtConfig, jwtPassportConfig, REDIS_CONFIG, redisConfig, TYPEORM_CONFIG, typeormConfig, WINSTON_CONFIG, winstonConfig } from '@libs/config';
import { GlobalHttpExceptionFilter, GlobalValidationPipe } from '@libs/http';
import { RedisModule } from '@libs/redis';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['apps/api/.env', '.env'],
      load: [httpConfig, cookieConfig, jwtConfig, jwtPassportConfig, winstonConfig, typeormConfig, redisConfig],
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
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return configService.getOrThrow(TYPEORM_CONFIG);
      },
    }),
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
export class ApiModule {}
