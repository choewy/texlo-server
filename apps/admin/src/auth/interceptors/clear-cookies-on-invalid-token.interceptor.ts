import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';

import { type Response } from 'express';
import { catchError, Observable, throwError } from 'rxjs';

import { COOKIE_SERVICE, type CookieService } from '@libs/http';

import { CookieKey } from '@apps/api/common';

import { InvalidTokenException } from '../exceptions';

@Injectable()
export class ClearCookiesOnInvalidTokenInterceptor implements NestInterceptor {
  constructor(
    @Inject(COOKIE_SERVICE)
    private readonly cookieService: CookieService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const res = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      catchError((error: unknown) => {
        if (error instanceof InvalidTokenException) {
          this.cookieService.clear(res, CookieKey.AccessToken);
          this.cookieService.clear(res, CookieKey.RefreshToken);
        }

        return throwError(() => error);
      }),
    );
  }
}
