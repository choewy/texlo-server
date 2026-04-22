import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable } from '@nestjs/common';

import { Request } from 'express';

import { type StorageConfig, storageConfig } from '@libs/config';

@Injectable()
export class BucketGuard implements CanActivate {
  constructor(
    @Inject(storageConfig.KEY)
    private readonly storageConfig: StorageConfig,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const key = req.headers['x-texlo-storage-key'];

    if (key === this.storageConfig.key) {
      return true;
    }

    throw new ForbiddenException();
  }
}
