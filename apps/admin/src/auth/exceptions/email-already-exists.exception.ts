import { HttpStatus } from '@nestjs/common';

import { BaseHttpException } from '@libs/http';

export class EmailAlreadyExistsException extends BaseHttpException {
  constructor() {
    super(HttpStatus.CONFLICT, 'Email already exists', 'EMAIL_ALREADY_EXISTS');
  }
}
