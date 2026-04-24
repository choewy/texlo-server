import { HttpStatus } from '@nestjs/common';

import { BaseHttpException } from '@libs/http';

export class InvalidTokenException extends BaseHttpException {
  constructor() {
    super(HttpStatus.UNAUTHORIZED, 'Invalid token', 'INVALID_TOKEN');
  }
}
