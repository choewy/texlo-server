import { ConfigService, ConfigType, registerAs } from '@nestjs/config';

import { TYPECAST_CONFIG } from '../tokens';

export const typecastConfig = registerAs(TYPECAST_CONFIG, () => {
  const configService = new ConfigService();

  return {
    apiKey: configService.getOrThrow<string>('TYPECAST_API_KEY'),
  };
});

export type TypecastConfig = ConfigType<typeof typecastConfig>;
