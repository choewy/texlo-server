import { Inject, Injectable } from '@nestjs/common';

import { randomUUID } from 'crypto';

import { REDIS_CLIENT, RedisClient } from '@libs/redis';

import { AuthTokenStore } from './auth-token.store';
import { AuthTokenValue } from './auth-token.value';

@Injectable()
export class RedisAuthTokenStore implements AuthTokenStore {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redisClient: RedisClient,
  ) {}

  private key(authToken: string) {
    return `api:auth:${authToken}`;
  }

  async get(authToken: string): Promise<AuthTokenValue | null> {
    return this.redisClient.getJSON<AuthTokenValue>(this.key(authToken));
  }

  async set(value: AuthTokenValue): Promise<string> {
    const authToken = randomUUID();
    const key = this.key(authToken);

    await this.redisClient.setJSON(key, value);
    await this.redisClient.expire(key, 60 * 10);

    return authToken;
  }

  async revoke(authToken: string): Promise<void> {
    await this.redisClient.del(this.key(authToken));
  }
}
