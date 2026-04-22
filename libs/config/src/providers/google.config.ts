import { ConfigService, ConfigType, registerAs } from '@nestjs/config';

import { GOOGLE_OAUTH_CONFIG } from '../tokens';

export const googleOAuthConfig = registerAs(GOOGLE_OAUTH_CONFIG, () => {
  const configService = new ConfigService();

  return {
    clientId: configService.getOrThrow<string>('GOOGLE_OAUTH_CLIENT_ID'),
    clientSecret: configService.getOrThrow<string>('GOOGLE_OAUTH_CLIENT_SECRET'),
    redirectURI: configService.getOrThrow<string>('GOOGLE_OAUTH_REDIRECT_URI'),
  };
});

export type GoogleOAuthConfig = ConfigType<typeof googleOAuthConfig>;
