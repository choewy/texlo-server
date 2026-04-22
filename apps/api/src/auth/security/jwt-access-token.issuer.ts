import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AccessTokenIssuer } from './access-token.issuer';
import { JwtClaims } from './jwt-claims';

@Injectable()
export class JwtAccessTokenIssuer implements AccessTokenIssuer {
  constructor(private readonly jwtService: JwtService) {}

  async issue(id: string): Promise<string> {
    return this.jwtService.signAsync(new JwtClaims(id).toObject(), { expiresIn: 10 * 60 });
  }
}
