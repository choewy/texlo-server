import { ConfigService, ConfigType, registerAs } from '@nestjs/config';

import { SUPERTONE_CONFIG } from '../tokens';

export const supertoneConfig = registerAs(SUPERTONE_CONFIG, () => {
  const configService = new ConfigService();

  return {
    apiKey: configService.getOrThrow<string>('SUPERTONE_API_KEY'),
  };
});

export type SupertoneConfig = ConfigType<typeof supertoneConfig>;
