import { ConfigService, registerAs } from '@nestjs/config';

import { NodeEnv } from '../enums';
import { COOKIE_CONFIG } from '../tokens';

export const cookieConfig = registerAs(COOKIE_CONFIG, () => {
  const configService = new ConfigService();
  const isLocal = configService.getOrThrow<NodeEnv>('NODE_ENV') === NodeEnv.Local;

  return {
    httpOnly: true,
    secure: isLocal ? false : true,
    sameSite: isLocal ? 'lax' : 'none',
  };
});
