import { Inject, Injectable } from '@nestjs/common';

import { AUTH_STORE, type AuthStore } from '../shared';

import { OAUTH_CLIENTS, OAuthClient } from './clients';
import { OAuthProvider } from './domain';
import { OAuthProfileFetchFailedException, OAuthProviderNotSupportedException, OAuthTokenExchangeFailedException } from './exceptions';
import { OAUTH_REPOSITORY, type OAuthRepository, USER_REPOSITORY, type UserRepository } from './repositories';
import { OAuthLoginInput, OAuthProcessInput } from './usecases';

@Injectable()
export class OAuthService {
  constructor(
    @Inject(OAUTH_CLIENTS)
    private readonly oauthClients: OAuthClient[],
    @Inject(AUTH_STORE)
    private readonly authStore: AuthStore,
    @Inject(OAUTH_REPOSITORY)
    private readonly oauthRepository: OAuthRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  private get(provider: OAuthProvider): OAuthClient {
    const oauthClient = this.oauthClients.find((oauthClient) => oauthClient.provider === provider);

    if (!oauthClient) {
      throw new OAuthProviderNotSupportedException(provider);
    }

    return oauthClient;
  }

  login(provider: OAuthProvider, input: OAuthLoginInput): string {
    return this.get(provider).createURL(input.redirectURL);
  }

  async process(provider: OAuthProvider, input: OAuthProcessInput): Promise<string> {
    const oauthClient = this.get(provider);

    const accessToken = await oauthClient.getToken(input.code).catch((e) => {
      throw new OAuthTokenExchangeFailedException(provider, e);
    });

    const profile = await oauthClient.getProfile(accessToken).catch((e) => {
      throw new OAuthProfileFetchFailedException(provider, e);
    });

    let oauth = await this.oauthRepository.findOne(profile);

    if (!oauth) {
      oauth = await this.userRepository.transaction(async (em) => {
        const user = await this.userRepository.insert(em);
        const oauth = await this.oauthRepository.insert(profile, user, em);
        return oauth;
      });
    } else {
      await this.oauthRepository.update(oauth.id, profile);
    }

    return this.authStore.set(oauth.userId);
  }
}
