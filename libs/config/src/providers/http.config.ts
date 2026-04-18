import { ConfigService, registerAs } from '@nestjs/config';

import { HTTP_CONFIG } from '../tokens';
import { HttpOptions } from '../types';

export const httpConfig = registerAs(HTTP_CONFIG, () => {
  const configService = new ConfigService();

  return {
    port: +configService.getOrThrow<string>('PORT'),
    hostname: configService.getOrThrow<string>('HOST'),
    cors: {
      origin: new RegExp(configService.getOrThrow<string>('CORS_ORIGIN')),
    },
  } as HttpOptions;
});
