import { DynamicModule, Module } from '@nestjs/common';

import { COOKIE_OPTIONS, COOKIE_SERVICE } from './contracts';
import { CookieService } from './providers';
import { CookieModuleAsyncOptions } from './types';

@Module({})
export class CookieModule {
  public static registerAsync(options: CookieModuleAsyncOptions): DynamicModule {
    return {
      module: CookieModule,
      providers: [
        {
          inject: options.inject,
          provide: COOKIE_OPTIONS,
          useFactory(...args: unknown[]) {
            return options.useFactory(...args);
          },
        },
        {
          provide: COOKIE_SERVICE,
          useExisting: CookieService,
        },
        CookieService,
      ],
      exports: [COOKIE_SERVICE],
    };
  }
}
