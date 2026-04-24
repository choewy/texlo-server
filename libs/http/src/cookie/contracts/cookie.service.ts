import { Request, Response } from 'express';

export interface CookieService {
  parseTokens(req: Request): { accessToken: string; refreshToken: string };
  parseAccessToken(req: Request): string;
  parseRefreshToken(req: Request): string;
  setCacheControl(res: Response): void;
  setAccessToken(res: Response, accessToken: string): void;
  clearAccessToken(res: Response): void;
  setRefreshToken(res: Response, refreshToken: string): void;
  clearRefreshToken(res: Response): void;
  setTokens(res: Response, tokens: { accessToken: string; refreshToken: string }): void;
  clearTokens(res: Response): void;
}
