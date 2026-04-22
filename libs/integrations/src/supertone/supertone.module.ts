import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Module } from '@nestjs/common';

import { SupertoneClientImpl } from './implements';
import { SUPERTONE_CLIENT, SUPERTONE_OPTIONS } from './tokens';
import { SupertoneModuleAsyncOptions, SupertoneModuleProviderMap } from './types';

@Module({})
export class SupertoneModule {
  public static forRootAsync(options: SupertoneModuleAsyncOptions): DynamicModule {
    const { providers, exports } = this.createProviderMap(options);

    return {
      global: true,
      imports: [HttpModule],
      module: SupertoneModule,
      providers,
      exports,
    };
  }

  public static registerAsync(options: SupertoneModuleAsyncOptions): DynamicModule {
    const { providers, exports } = this.createProviderMap(options);

    return {
      module: SupertoneModule,
      imports: [HttpModule],
      providers,
      exports,
    };
  }

  private static createProviderMap(options: SupertoneModuleAsyncOptions): SupertoneModuleProviderMap {
    const providerMap: SupertoneModuleProviderMap = {
      providers: [
        {
          inject: options.inject,
          provide: SUPERTONE_OPTIONS,
          useFactory(...args: unknown[]) {
            return options.useFactory(...args);
          },
        },
        {
          provide: SUPERTONE_CLIENT,
          useExisting: SupertoneClientImpl,
        },
        SupertoneClientImpl,
      ],
      exports: [SUPERTONE_CLIENT],
    };

    return providerMap;
  }
}
