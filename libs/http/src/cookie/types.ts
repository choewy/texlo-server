import { InjectionToken, OptionalFactoryDependency } from '@nestjs/common';

import { CookieOptions } from 'express';

export type CookieModuleOptions = CookieOptions;
export type CookieModuleAsyncOptions = {
  inject?: (InjectionToken | OptionalFactoryDependency)[];
  useFactory(...args: unknown[]): CookieOptions;
};
