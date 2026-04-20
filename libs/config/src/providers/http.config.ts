import { ConfigService, ConfigType, registerAs } from '@nestjs/config';

import { HTTP_CONFIG } from '../tokens';

export const httpConfig = registerAs(HTTP_CONFIG, () => {
  const configService = new ConfigService();

  return {
    port: +configService.getOrThrow<string>('PORT'),
    hostname: configService.getOrThrow<string>('HOST'),
    cors: {
      origin: new RegExp(configService.getOrThrow<string>('CORS_ORIGIN')),
    },
  };
});

export type HttpConfig = ConfigType<typeof httpConfig>;
