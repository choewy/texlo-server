import { DynamicModule, Module } from '@nestjs/common';

import { RedisOptions } from 'ioredis';

import { RedisClient, RedisPublisher, RedisSubscriber } from './providers';
import { REDIS_CLIENT, REDIS_OPTIONS, REDIS_PUBLISHER, REDIS_SUBSCRIBER } from './tokens';
import { RedisModuleAsyncOptions, RedisModuleProviderMap } from './types';

@Module({})
export class RedisModule {
  private static createProviderMap(options: RedisModuleAsyncOptions): RedisModuleProviderMap {
    const providerMap: RedisModuleProviderMap = {
      exports: [REDIS_CLIENT],
      providers: [
        {
          inject: options.inject,
          provide: REDIS_OPTIONS,
          useFactory: (...args: unknown[]) => options.useFactory(...args),
        },
        {
          inject: [REDIS_OPTIONS],
          provide: REDIS_CLIENT,
          useFactory: (redisOptions: RedisOptions) => new RedisClient(redisOptions),
        },
        {
          provide: RedisClient,
          useExisting: REDIS_CLIENT,
        },
      ],
    };

    if (options.publisher) {
      providerMap.exports.push(REDIS_PUBLISHER);
      providerMap.providers.push(
        {
          inject: [REDIS_OPTIONS],
          provide: REDIS_PUBLISHER,
          useFactory: (redisOptions: RedisOptions) => new RedisPublisher(redisOptions),
        },
        {
          provide: RedisPublisher,
          useExisting: REDIS_PUBLISHER,
        },
      );
    }

    if (options.subscriber) {
      providerMap.exports.push(REDIS_SUBSCRIBER);
      providerMap.providers.push(
        {
          inject: [REDIS_OPTIONS],
          provide: REDIS_SUBSCRIBER,
          useFactory: (redisOptions: RedisOptions) => new RedisSubscriber(redisOptions),
        },
        {
          provide: RedisSubscriber,
          useExisting: REDIS_SUBSCRIBER,
        },
      );
    }

    return providerMap;
  }

  public static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
    const providerMap = this.createProviderMap(options);

    return {
      global: true,
      module: RedisModule,
      providers: providerMap.providers,
      exports: providerMap.exports,
    };
  }
}
