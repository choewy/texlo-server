import { HttpStatus } from '@nestjs/common';

import { BaseHttpException } from '@libs/http';

export class NotFoundVoiceException extends BaseHttpException {
  constructor() {
    super(HttpStatus.NOT_FOUND, 'Not found voice', 'NOT_FOUND_VOICE');
  }
}
