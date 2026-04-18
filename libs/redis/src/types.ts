import { Abstract, DynamicModule, ForwardReference, InjectionToken, OptionalFactoryDependency, Provider } from '@nestjs/common';

import { RedisOptions } from 'ioredis';

export type RedisModuleOptions = RedisOptions;
export type RedisModuleAsyncOptions = {
  publisher?: boolean;
  subscriber?: boolean;
  inject?: (InjectionToken | OptionalFactoryDependency)[];
  useFactory(...args: unknown[]): RedisModuleOptions;
};
export type RedisModuleProviderMap = {
  providers: Provider[];
  exports: (string | symbol | Provider | Abstract<unknown> | DynamicModule | ForwardReference<unknown>)[];
};
