import { HttpStatus } from '@nestjs/common';

import { BaseHttpException } from '@libs/http';

export class InvalidCredentialsException extends BaseHttpException {
  constructor() {
    super(HttpStatus.UNAUTHORIZED, 'Invalid email or password', 'INVALID_CREDENTIALS');
  }
}
