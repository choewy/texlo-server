import { HttpStatus } from '@nestjs/common';

import { BaseHttpException } from '@libs/http';

export class TokenExpiredException extends BaseHttpException {
  constructor() {
    super(HttpStatus.UNAUTHORIZED, 'Token expired', 'TOKEN_EXPIRED');
  }
}
