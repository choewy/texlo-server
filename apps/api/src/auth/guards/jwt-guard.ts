import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokenExpiredError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

import { CONTEXT_SERVICE, type ContextService, ContextUser, IS_PUBLIC_KEY } from '@apps/api/common';

import { InvalidTokenException, TokenExpiredException } from '../exceptions';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    @Inject(CONTEXT_SERVICE)
    private readonly contextService: ContextService,
  ) {
    super();
  }

  override canActivate(context: ExecutionContext) {
    this.contextService.context = context;

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  override handleRequest<TUser = unknown>(e: unknown, user: TUser, info: unknown) {
    if (e instanceof TokenExpiredException || e instanceof InvalidTokenException) {
      throw e;
    }

    if (info instanceof TokenExpiredError) {
      throw new TokenExpiredException();
    }

    if (e || info) {
      throw new InvalidTokenException();
    }

    this.contextService.user = user as ContextUser;

    return user ?? null;
  }
}
