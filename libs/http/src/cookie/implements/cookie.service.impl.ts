import { Inject, Injectable } from '@nestjs/common';

import { type CookieOptions, type Request, type Response } from 'express';

import { CookieService } from '../contracts';
import { COOKIE_OPTIONS } from '../tokens';

@Injectable()
export class CookieServiceImpl implements CookieService {
  constructor(
    @Inject(COOKIE_OPTIONS)
    private readonly cookieOptions: CookieOptions,
  ) {}

  private getCookies(request: Request): Record<string, string> {
    return request.cookies;
  }

  setCacheControl(response: Response): void {
    response.setHeader('Cache-Control', 'no-store');
  }

  parse(req: Request, key: string): string {
    return (this.getCookies(req)[key] ?? '').trim();
  }

  set(res: Response, key: string, value: string, maxAgeDays?: number): void {
    res.cookie(key, value, {
      ...this.cookieOptions,
      maxAge: maxAgeDays ? 1000 * 60 * 60 * 24 * maxAgeDays : undefined,
      path: '/',
    });
  }

  clear(res: Response, key: string): void {
    res.cookie(key, '', {
      ...this.cookieOptions,
      expires: new Date(0),
      maxAge: 0,
      path: '/',
    });
  }
}
