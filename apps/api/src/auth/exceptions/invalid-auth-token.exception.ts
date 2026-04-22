import { HttpStatus } from '@nestjs/common';

import { BaseHttpException } from '@libs/http';

export class InvalidAuthTokenException extends BaseHttpException {
  constructor() {
    super(HttpStatus.UNAUTHORIZED, 'Invalid auth token', 'INVALID_AUTH_TOKEN');
  }
}
