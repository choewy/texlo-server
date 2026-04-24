import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import { COOKIE_CONFIG, JWT_CONFIG } from '@libs/config';
import { CookieModule } from '@libs/http';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtGuard, JwtStrategy } from './guards';
import { ClearCookiesOnInvalidTokenInterceptor } from './interceptors';
import { ADMIN_REPOSITORY, TypeOrmAdminRepository } from './repositories';
import { ACCESS_TOKEN_ISSUER, BcryptPasswordHasher, JwtAccessTokenIssuer, JwtRefreshTokenIssuer, PASSWORD_HASHER, REFRESH_TOKEN_ISSUER } from './security';

@Module({
  imports: [
    CookieModule.registerAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return configService.getOrThrow(COOKIE_CONFIG);
      },
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return configService.getOrThrow(JWT_CONFIG);
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    ClearCookiesOnInvalidTokenInterceptor,
    JwtStrategy,
    {
      provide: ADMIN_REPOSITORY,
      useClass: TypeOrmAdminRepository,
    },
    {
      provide: ACCESS_TOKEN_ISSUER,
      useClass: JwtAccessTokenIssuer,
    },
    {
      provide: REFRESH_TOKEN_ISSUER,
      useClass: JwtRefreshTokenIssuer,
    },
    {
      provide: PASSWORD_HASHER,
      useClass: BcryptPasswordHasher,
    },
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AuthModule {}
