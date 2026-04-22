import { BullRootModuleOptions } from '@nestjs/bullmq';
import { ConfigService, ConfigType, registerAs } from '@nestjs/config';

import { RedisOptions } from 'ioredis';

import { BULL_MQ_CONFIG, REDIS_CONFIG } from '../tokens';

export const redisConfig = registerAs(REDIS_CONFIG, (): RedisOptions => {
  const configService = new ConfigService();

  return {
    host: configService.getOrThrow<string>('REDIS_HOST'),
    port: +configService.getOrThrow<string>('REDIS_PORT'),
  };
});

export type RedisConfig = ConfigType<typeof redisConfig>;

export const bullMqConfig = registerAs(BULL_MQ_CONFIG, (): BullRootModuleOptions => {
  const configService = new ConfigService();

  return {
    prefix: 'bullmq',
    connection: {
      host: configService.getOrThrow<string>('REDIS_HOST'),
      port: +configService.getOrThrow<string>('REDIS_PORT'),
    },
  };
});

export type BullMqConfig = ConfigType<typeof bullMqConfig>;
