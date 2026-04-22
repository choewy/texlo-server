import { Inject, Injectable } from '@nestjs/common';

import { type CookieOptions, type Request, type Response } from 'express';

import { CookieService } from '../contracts';
import { CookieKey } from '../enums';
import { COOKIE_OPTIONS } from '../tokens';

@Injectable()
export class CookieServiceImpl implements CookieService {
  constructor(
    @Inject(COOKIE_OPTIONS)
    private readonly cookieOptions: CookieOptions,
  ) {}

  private getCookies(request: Request) {
    return request.cookies as Record<CookieKey, string>;
  }

  parseAccessToken(request: Request): string {
    return (this.getCookies(request)[CookieKey.AccessToken] ?? '').trim();
  }

  parseRefreshToken(request: Request): string {
    return (this.getCookies(request)[CookieKey.RefreshToken] ?? '').trim();
  }

  setCacheControl(response: Response): void {
    response.setHeader('Cache-Control', 'no-store');
  }

  setAuthSession(response: Response, accessToken: string, refreshToken: string): void {
    this.setAccessToken(response, accessToken);
    this.setRefreshToken(response, refreshToken);
  }

  clearAuthSession(response: Response): void {
    this.clearAccessToken(response);
    this.clearRefreshToken(response);
  }

  setAccessToken(response: Response, accessToken: string): void {
    response.cookie(CookieKey.AccessToken, accessToken, {
      ...this.cookieOptions,
      maxAge: 1000 * 60 * 60 * 24 * 20,
      path: '/',
    });
  }

  clearAccessToken(response: Response): void {
    response.cookie(CookieKey.AccessToken, '', {
      ...this.cookieOptions,
      expires: new Date(0),
      maxAge: 0,
      path: '/',
    });
  }

  setRefreshToken(response: Response, refreshToken: string) {
    response.cookie(CookieKey.RefreshToken, refreshToken, {
      ...this.cookieOptions,
      maxAge: 1000 * 60 * 60 * 24 * 20,
      path: '/api/v1',
    });
  }

  clearRefreshToken(response: Response) {
    response.cookie(CookieKey.RefreshToken, '', {
      ...this.cookieOptions,
      expires: new Date(0),
      maxAge: 0,
      path: '/api/v1',
    });
  }
}
