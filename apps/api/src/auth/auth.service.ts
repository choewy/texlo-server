import { Inject, Injectable } from '@nestjs/common';

import { AUTH_TOKEN_STORE, type AuthTokenStore } from '../shared';

import { InvalidAuthTokenException, InvalidTokenException } from './exceptions';
import { ACCESS_TOKEN_ISSUER, type AccessTokenIssuer, REFRESH_TOKEN_ISSUER, type RefreshTokenIssuer } from './security';
import { IssueTokenInput, IssueTokenResult, LogoutInput, RefreshTokenInput, RefreshTokenResult } from './usecaces';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_TOKEN_STORE)
    private readonly authTokenStore: AuthTokenStore,
    @Inject(ACCESS_TOKEN_ISSUER)
    private readonly accessTokenIssuer: AccessTokenIssuer,
    @Inject(REFRESH_TOKEN_ISSUER)
    private readonly refreshTokenIssuer: RefreshTokenIssuer,
  ) {}

  async issue(input: IssueTokenInput): Promise<IssueTokenResult> {
    const value = await this.authTokenStore.get(input.authToken);

    if (!value) {
      throw new InvalidAuthTokenException();
    }

    const accessToken = await this.accessTokenIssuer.issue(value);
    const refreshToken = await this.refreshTokenIssuer.issue(value, accessToken);

    await this.authTokenStore.revoke(input.authToken);

    return { accessToken, refreshToken };
  }

  async refresh(input: RefreshTokenInput): Promise<RefreshTokenResult> {
    const value = await this.refreshTokenIssuer.get(input.refreshToken);

    if (!value) {
      throw new InvalidTokenException();
    }

    if (value.accessToken !== input.accessToken) {
      throw new InvalidTokenException();
    }

    const accessToken = await this.accessTokenIssuer.issue(value);
    const refreshToken = await this.refreshTokenIssuer.issue(value, accessToken);

    await this.refreshTokenIssuer.revoke(input.refreshToken);

    return { accessToken, refreshToken };
  }

  async logout(input: LogoutInput): Promise<void> {
    const value = await this.refreshTokenIssuer.get(input.refreshToken);

    if (!value) {
      return;
    }

    if (value.accessToken !== input.accessToken) {
      return;
    }

    await this.refreshTokenIssuer.revoke(input.refreshToken);
  }
}
