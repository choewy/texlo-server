import { Inject, Injectable } from '@nestjs/common';

import { randomUUID } from 'crypto';

import { REDIS_CLIENT, RedisClient } from '@libs/redis';

import { AuthStore } from './auth.store';

@Injectable()
export class RedisAuthStore implements AuthStore {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redisClient: RedisClient,
  ) {}

  private key(authToken: string) {
    return `auth:${authToken}`;
  }

  async get(authToken: string): Promise<string | null> {
    return this.redisClient.get(this.key(authToken));
  }

  async set(userId: string): Promise<string> {
    const authToken = randomUUID();
    const key = this.key(authToken);

    await this.redisClient.set(key, userId);
    await this.redisClient.expire(key, 60 * 10);

    return authToken;
  }

  async revoke(authToken: string): Promise<void> {
    await this.redisClient.del(this.key(authToken));
  }
}
