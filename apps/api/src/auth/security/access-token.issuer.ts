import { JwtClaims } from './jwt-claims';

export interface AccessTokenIssuer {
  issue(claims: JwtClaims): Promise<string>;
}
