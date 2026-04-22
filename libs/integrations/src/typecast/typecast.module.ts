import { DynamicModule, Module } from '@nestjs/common';

import { TypecastClientImpl } from './implements';
import { TYPECAST_CLIENT, TYPECAST_OPTIONS } from './tokens';
import { TypecastModuleAsyncOptions, TypecastModuleProviderMap } from './types';

@Module({})
export class TypecastModule {
  public static forRootAsync(options: TypecastModuleAsyncOptions): DynamicModule {
    const { providers, exports } = this.createProviderMap(options);

    return {
      global: true,
      module: TypecastModule,
      providers,
      exports,
    };
  }

  public static registerAsync(options: TypecastModuleAsyncOptions): DynamicModule {
    const { providers, exports } = this.createProviderMap(options);

    return {
      module: TypecastModule,
      providers,
      exports,
    };
  }

  private static createProviderMap(options: TypecastModuleAsyncOptions): TypecastModuleProviderMap {
    const providerMap: TypecastModuleProviderMap = {
      providers: [
        {
          inject: options.inject,
          provide: TYPECAST_OPTIONS,
          useFactory(...args: unknown[]) {
            return options.useFactory(...args);
          },
        },
        {
          provide: TYPECAST_CLIENT,
          useExisting: TypecastClientImpl,
        },
        TypecastClientImpl,
      ],
      exports: [TYPECAST_CLIENT],
    };

    return providerMap;
  }
}
