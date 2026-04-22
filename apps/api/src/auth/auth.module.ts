import { Module } from '@nestjs/common';

import { AUTH_STORE, RedisAuthStore } from '../shared';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: AUTH_STORE,
      useClass: RedisAuthStore,
    },
  ],
})
export class AuthModule {}
