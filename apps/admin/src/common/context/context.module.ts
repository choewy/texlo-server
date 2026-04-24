import { Global, Module } from '@nestjs/common';

import { randomUUID } from 'crypto';
import { type Request, type Response } from 'express';
import { ClsModule, ClsService } from 'nestjs-cls';

import { ContextKey } from './enums';
import { ContextServiceImpl } from './implements';
import { CONTEXT_SERVICE } from './tokens';

@Global()
@Module({
  imports: [
    ClsModule.forRoot({
      middleware: {
        mount: true,
        setup(cls: ClsService, req: Request, res: Response) {
          const requestIdKey = 'x-request-id';
          const requestId = req.headers[requestIdKey] ?? randomUUID();

          req.headers[requestIdKey] = requestId;
          res.set(requestIdKey, requestId);

          const ip = req.headers['x-forwarded-for']?.toString().split(',')[0] ?? req.headers['x-real-ip'] ?? req.ip;

          cls.set(requestIdKey, requestId);
          cls.set(ContextKey.RequestMethod, req.method);
          cls.set(ContextKey.RequestURL, req.url);
          cls.set(ContextKey.RequestIpAddress, ip === '::1' ? '127.0.0.1' : ip);
        },
      },
    }),
  ],
  providers: [
    {
      provide: CONTEXT_SERVICE,
      useClass: ContextServiceImpl,
    },
  ],
  exports: [CONTEXT_SERVICE],
})
export class ContextModule {}
