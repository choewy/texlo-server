import { ConfigService, registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

import { JWT_CONFIG, JWT_PASSPORT_CONFIG } from '../tokens';

export const jwtConfig = registerAs(JWT_CONFIG, () => {
  const configService = new ConfigService();

  return {
    secret: configService.getOrThrow<string>('JWT_SECRET'),
  } as JwtModuleOptions;
});

export const jwtPassportConfig = registerAs(JWT_PASSPORT_CONFIG, () => {
  const configService = new ConfigService();

  return {
    secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
  } as { secretOrKey: string };
});
