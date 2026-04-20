import { HttpStatus } from '@nestjs/common';

import { Types } from 'mongoose';

import { BaseHttpException } from '@libs/http';

export class NotFoundFileException extends BaseHttpException {
  constructor(id: Types.ObjectId | string) {
    super(HttpStatus.NOT_FOUND, `Cannot GET /${id.toString()}`, 'NOT_FOUND_FILE');
  }
}
