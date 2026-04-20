import { ConfigService, ConfigType, registerAs } from '@nestjs/config';

import { RedisOptions } from 'ioredis';

import { REDIS_CONFIG } from '../tokens';

export const redisConfig = registerAs(REDIS_CONFIG, (): RedisOptions => {
  const configService = new ConfigService();

  return {
    host: configService.getOrThrow<string>('REDIS_HOST'),
    port: +configService.getOrThrow<string>('REDIS_PORT'),
  };
});

export type RedisConfig = ConfigType<typeof redisConfig>;
