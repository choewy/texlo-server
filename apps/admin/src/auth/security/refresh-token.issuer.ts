import { JwtClaims } from './jwt-claims';

export interface RefreshTokenIssuer {
  issue(claims: JwtClaims, accessToken: string): Promise<string>;
  get(refreshToken: string): Promise<(JwtClaims & { accessToken: string }) | null>;
  revoke(refreshToken: string): Promise<void>;
}
