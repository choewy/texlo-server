import { Inject, Injectable } from '@nestjs/common';

import { randomUUID } from 'crypto';

import { REDIS_CLIENT, RedisClient } from '@libs/redis';

import { JwtClaims } from './jwt-claims';
import { RefreshTokenIssuer } from './refresh-token.issuer';

@Injectable()
export class JwtRefreshTokenIssuer implements RefreshTokenIssuer {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redisClient: RedisClient,
  ) {}

  private key(refreshToken: string) {
    return `admin:jwt:${refreshToken}`;
  }

  async issue(claims: JwtClaims, accessToken: string): Promise<string> {
    const refreshToken = randomUUID();
    const key = this.key(refreshToken);

    await this.redisClient.setJSON(key, { id: claims.id, accessToken });
    await this.redisClient.expire(key, 60 * 60 * 24 * 20);

    return refreshToken;
  }

  async get(refreshToken: string): Promise<(JwtClaims & { accessToken: string }) | null> {
    const key = this.key(refreshToken);

    return this.redisClient.getJSON(key);
  }

  async revoke(refreshToken: string): Promise<void> {
    const key = this.key(refreshToken);

    await this.redisClient.del(key);
  }
}
