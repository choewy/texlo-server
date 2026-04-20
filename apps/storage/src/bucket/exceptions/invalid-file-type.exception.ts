import { HttpStatus } from '@nestjs/common';

import { BaseHttpException } from '@libs/http';

export class InvalidFileTypeException extends BaseHttpException {
  constructor() {
    super(HttpStatus.BAD_REQUEST, 'Invalid file type', 'INVALID_FILE_TYPE');
  }
}
