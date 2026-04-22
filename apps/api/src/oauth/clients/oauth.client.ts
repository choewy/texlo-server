import { OAuthProfile, OAuthProvider } from '../domain';

export interface OAuthClient {
  readonly provider: OAuthProvider;
  createURL(redirectURL: string): string;
  getToken(code: string): Promise<string>;
  getProfile(accessToken: string): Promise<OAuthProfile>;
}
