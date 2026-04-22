import { ConfigService, ConfigType, registerAs } from '@nestjs/config';

import { STORAGE_CLIENT_CONFIG, STORAGE_CONFIG } from '../tokens';

export const storageConfig = registerAs(STORAGE_CONFIG, () => {
  const configService = new ConfigService();

  return {
    key: configService.getOrThrow<string>('STORAGE_KEY'),
  };
});

export type StorageConfig = ConfigType<typeof storageConfig>;

export const storageClientConfig = registerAs(STORAGE_CLIENT_CONFIG, () => {
  const configService = new ConfigService();

  return {
    key: configService.getOrThrow<string>('STORAGE_KEY'),
    url: configService.getOrThrow<string>('STORAGE_URL'),
  };
});

export type StorageClientConfig = ConfigType<typeof storageClientConfig>;
