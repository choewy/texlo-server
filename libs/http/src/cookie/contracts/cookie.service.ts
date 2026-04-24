import { Request, Response } from 'express';

export interface CookieService {
  setCacheControl(res: Response): void;
  parse(req: Request, key: string): string;
  set(res: Response, key: string, value: string, maxAgeDays?: number): void;
  clear(res: Response, key: string): void;
}
