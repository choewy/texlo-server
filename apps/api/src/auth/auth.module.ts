import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import { COOKIE_CONFIG, JWT_CONFIG } from '@libs/config';
import { CookieModule } from '@libs/http';

import { AUTH_STORE, RedisAuthStore } from '../shared';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtGuard, JwtStrategy } from './guards';
import { ClearCookiesOnInvalidTokenInterceptor } from './interceptors';
import { ACCESS_TOKEN_ISSUER, JwtAccessTokenIssuer } from './security';

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
    JwtStrategy,
    ClearCookiesOnInvalidTokenInterceptor,
    {
      provide: AUTH_STORE,
      useClass: RedisAuthStore,
    },
    {
      provide: ACCESS_TOKEN_ISSUER,
      useClass: JwtAccessTokenIssuer,
    },
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AuthModule {}
