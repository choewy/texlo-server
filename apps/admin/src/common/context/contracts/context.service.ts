import { ExecutionContext } from '@nestjs/common';

import { ContextUser } from '../domain';

export interface ContextService {
  get user(): ContextUser;
  set user(user: ContextUser);
  get context(): string | null;
  set context(context: ExecutionContext);
}
