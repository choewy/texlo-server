import { Inject, Injectable } from '@nestjs/common';

import axios, { AxiosInstance } from 'axios';
import { stringify } from 'querystring';

import { type GoogleOAuthConfig, googleOAuthConfig } from '@libs/config';

import { OAuthProvider } from '@apps/api/shared';

import { OAuthProfile } from '../domain';

import { OAuthClient } from './oauth.client';

@Injectable()
export class GoogleOAuthClient implements OAuthClient {
  private readonly api: AxiosInstance;

  readonly provider = OAuthProvider.Google;

  constructor(
    @Inject(googleOAuthConfig.KEY)
    private readonly config: GoogleOAuthConfig,
  ) {
    this.api = axios.create();
  }

  createURL(redirectURL: string): string {
    const url = 'https://accounts.google.com/o/oauth2/v2/auth';
    const params = {
      response_type: 'code',
      redirect_uri: this.config.redirectURI,
      client_id: this.config.clientId,
      scope: ['email', 'profile'].join(' '),
      state: redirectURL,
    };

    return `${url}?${stringify(params)}`;
  }

  async getToken(code: string): Promise<string> {
    const url = 'https://oauth2.googleapis.com/token';
    const { data } = await this.api.post<{ access_token: string }>(url, {
      code,
      grant_type: 'authorization_code',
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      redirect_uri: this.config.redirectURI,
    });

    return data.access_token;
  }

  async getProfile(accessToken: string): Promise<OAuthProfile> {
    const url = 'https://www.googleapis.com/userinfo/v2/me';

    const { data } = await this.api.get<{
      id: string;
      email: string;
      name: string;
      picture: string;
    }>(url, {
      params: { access_token: accessToken },
    });

    return {
      provider: OAuthProvider.Google,
      providerId: data.id,
      email: data.email,
      name: data.name,
      profileImageUrl: data.picture,
    };
  }
}
