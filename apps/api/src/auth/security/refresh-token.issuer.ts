export interface RefreshTokenIssuer {
  issue(id: string, accessToken: string): Promise<string>;
  get(refreshToken: string): Promise<{ id: string; accessToken: string } | null>;
  revoke(refreshToken: string): Promise<void>;
}
