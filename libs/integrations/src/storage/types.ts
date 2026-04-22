import { Abstract, DynamicModule, ForwardReference, InjectionToken, OptionalFactoryDependency, Provider } from '@nestjs/common';

export type StorageOptions = {
  key: string;
  url: string;
};

export type StorageModuleOptions = StorageOptions;
export type StorageModuleAsyncOptions = {
  inject?: (InjectionToken | OptionalFactoryDependency)[];
  useFactory(...args: unknown[]): StorageModuleOptions;
};

export type StorageModuleProviderMap = {
  providers: Provider[];
  exports: (string | symbol | Provider | Abstract<unknown> | DynamicModule | ForwardReference<unknown>)[];
};
