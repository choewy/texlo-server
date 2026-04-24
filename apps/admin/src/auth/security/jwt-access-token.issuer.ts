import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AccessTokenIssuer } from './access-token.issuer';
import { JwtClaims } from './jwt-claims';

@Injectable()
export class JwtAccessTokenIssuer implements AccessTokenIssuer {
  constructor(private readonly jwtService: JwtService) {}

  async issue(claims: JwtClaims): Promise<string> {
    return this.jwtService.signAsync({ id: claims.id }, { expiresIn: 10 * 60 });
  }
}
