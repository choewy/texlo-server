import { Inject, Injectable } from '@nestjs/common';

import { AUTH_TOKEN_STORE, type AuthTokenStore, OAuthProvider } from '../shared';

import { OAUTH_CLIENTS, OAuthClient } from './clients';
import { OAuthProfileFetchFailedException, OAuthProviderNotSupportedException, OAuthTokenExchangeFailedException } from './exceptions';
import { OAUTH_REPOSITORY, OAUTH_UNIT_OF_WORK, type OAuthRepository, type OAuthUnitOfWork } from './repositories';
import { OAuthLoginInput, OAuthProcessInput } from './usecases';

@Injectable()
export class OAuthService {
  constructor(
    @Inject(OAUTH_CLIENTS)
    private readonly oauthClients: OAuthClient[],
    @Inject(AUTH_TOKEN_STORE)
    private readonly authTokenStore: AuthTokenStore,
    @Inject(OAUTH_REPOSITORY)
    private readonly oauthRepository: OAuthRepository,
    @Inject(OAUTH_UNIT_OF_WORK)
    private readonly oauthUnitOfWork: OAuthUnitOfWork,
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

    if (oauth) {
      await this.oauthRepository.update(oauth.id, profile);
    } else {
      oauth = await this.oauthUnitOfWork.tx(async (repo) => {
        const user = await repo.user.insert(profile);

        return repo.oauth.insert(profile, user);
      });
    }

    return this.authTokenStore.set({ oauthId: oauth.id, userId: oauth.userId });
  }
}
