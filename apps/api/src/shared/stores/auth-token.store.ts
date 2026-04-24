import { AuthTokenValue } from './auth-token.value';

export interface AuthTokenStore {
  get(authToken: string): Promise<AuthTokenValue | null>;
  set(value: AuthTokenValue): Promise<string>;
  revoke(authToken: string): Promise<void>;
}
