import { Inject, Injectable } from '@nestjs/common';

import { AUTH_STORE, type AuthStore } from '../shared';

import { InvalidAuthTokenException } from './exceptions';
import { ACCESS_TOKEN_ISSUER, type AccessTokenIssuer } from './security';
import { IssueTokenInput } from './usecaces';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_STORE)
    private readonly authTokenStore: AuthStore,
    @Inject(ACCESS_TOKEN_ISSUER)
    private readonly accessTokenIssuer: AccessTokenIssuer,
  ) {}

  async issue(input: IssueTokenInput) {
    const id = await this.authTokenStore.get(input.authToken);

    if (!id) {
      throw new InvalidAuthTokenException();
    }

    const accessToken = this.accessTokenIssuer.issue(id);

    return { accessToken };
  }

  async refresh() {
    await Promise.resolve();
    return;
  }

  async logout() {
    await Promise.resolve();
    return;
  }
}
