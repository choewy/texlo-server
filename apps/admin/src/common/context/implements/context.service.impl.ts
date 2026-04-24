import { ExecutionContext, Injectable } from '@nestjs/common';

import { ClsService } from 'nestjs-cls';

import { ContextService } from '../contracts';
import { ContextUser } from '../domain';
import { ContextKey } from '../enums';

@Injectable()
export class ContextServiceImpl implements ContextService {
  constructor(private readonly clsService: ClsService) {}

  get user(): ContextUser {
    return this.clsService.get(ContextKey.User);
  }

  set user(user: ContextUser) {
    this.clsService.set(ContextKey.User, user);
  }

  get context(): string | null {
    return this.clsService.get(ContextKey.ContextName);
  }

  set context(context: ExecutionContext) {
    const className = context?.getClass()?.name;
    const handlerName = context?.getHandler()?.name;

    this.clsService.set(ContextKey.ContextName, [className, handlerName].join('.'));
  }
}
