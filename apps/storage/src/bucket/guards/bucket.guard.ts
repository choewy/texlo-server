import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable } from '@nestjs/common';

import { Request } from 'express';

import { STORAGE_CONFIG, type StorageConfig } from '@libs/config';

@Injectable()
export class BucketGuard implements CanActivate {
  constructor(
    @Inject(STORAGE_CONFIG)
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
