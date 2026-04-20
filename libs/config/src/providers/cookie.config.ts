import { ConfigService, ConfigType, registerAs } from '@nestjs/config';

import { CookieOptions } from 'express';

import { NodeEnv } from '../enums';
import { COOKIE_CONFIG } from '../tokens';

export const cookieConfig = registerAs(COOKIE_CONFIG, (): CookieOptions => {
  const configService = new ConfigService();
  const isLocal = configService.getOrThrow<NodeEnv>('NODE_ENV') === NodeEnv.Local;

  return {
    httpOnly: true,
    secure: isLocal ? false : true,
    sameSite: isLocal ? 'lax' : 'none',
  };
});

export type CookieConfig = ConfigType<typeof cookieConfig>;
