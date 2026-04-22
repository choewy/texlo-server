import { DynamicModule, Module } from '@nestjs/common';

import { StorageClientImpl } from './implements';
import { STORAGE_CLIENT, STORAGE_OPTIONS } from './tokens';
import { StorageModuleAsyncOptions, StorageModuleProviderMap } from './types';

@Module({})
export class StorageModule {
  public static forRootAsync(options: StorageModuleAsyncOptions): DynamicModule {
    const { providers, exports } = this.createProviderMap(options);

    return {
      global: true,
      module: StorageModule,
      providers,
      exports,
    };
  }

  public static registerAsync(options: StorageModuleAsyncOptions): DynamicModule {
    const { providers, exports } = this.createProviderMap(options);

    return {
      module: StorageModule,
      providers,
      exports,
    };
  }

  private static createProviderMap(options: StorageModuleAsyncOptions): StorageModuleProviderMap {
    const providerMap: StorageModuleProviderMap = {
      providers: [
        {
          inject: options.inject,
          provide: STORAGE_OPTIONS,
          useFactory(...args: unknown[]) {
            return options.useFactory(...args);
          },
        },
        {
          provide: STORAGE_CLIENT,
          useExisting: StorageClientImpl,
        },
        StorageClientImpl,
      ],
      exports: [STORAGE_CLIENT],
    };

    return providerMap;
  }
}
