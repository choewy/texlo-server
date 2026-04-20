import { ConfigService, ConfigType, registerAs } from '@nestjs/config';

import { STORAGE_CONFIG } from '../tokens';

export const storageConfig = registerAs(STORAGE_CONFIG, () => {
  const configService = new ConfigService();

  return {
    key: configService.getOrThrow<string>('STORAGE_KEY'),
  };
});

export type StorageConfig = ConfigType<typeof storageConfig>;
