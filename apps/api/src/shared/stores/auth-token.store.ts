export interface AuthTokenStore {
  get(authToken: string): Promise<string | null>;
  set(userId: string): Promise<string>;
  revoke(authToken: string): Promise<void>;
}
