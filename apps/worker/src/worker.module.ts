import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WinstonModule } from 'nest-winston';

import { REDIS_CONFIG, redisConfig, storageConfig, TYPEORM_CONFIG, typeormConfig, WINSTON_CONFIG, winstonConfig } from '@libs/config';
import { RedisModule } from '@libs/redis';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['apps/api/.env', '.env'],
      load: [winstonConfig, typeormConfig, redisConfig, storageConfig],
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
})
export class WorkerModule {}
