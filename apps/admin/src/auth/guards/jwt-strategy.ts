import { Inject, Injectable } from '@nestjs/common';
import { type ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { Request } from 'express';
import { Strategy } from 'passport-jwt';

import { jwtPassportConfig } from '@libs/config';
import { COOKIE_SERVICE, type CookieService } from '@libs/http';

import { ContextUser, CookieKey } from '@apps/admin/common';

import { InvalidTokenException } from '../exceptions';
import { JwtClaims } from '../security';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(jwtPassportConfig.KEY)
    config: ConfigType<typeof jwtPassportConfig>,
    @Inject(COOKIE_SERVICE)
    cookieService: CookieService,
  ) {
    super({
      jwtFromRequest: (req: Request) => cookieService.parse(req, CookieKey.AccessToken),
      secretOrKey: config.secretOrKey,
    });
  }

  validate(user: JwtClaims): ContextUser {
    if (user instanceof Object === false || 'id' in user === false || typeof user.id !== 'string') {
      throw new InvalidTokenException();
    }

    return { id: user.id };
  }
}
