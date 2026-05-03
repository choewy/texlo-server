import { HttpStatus } from '@nestjs/common';

import { BaseHttpException } from '@libs/http';

export class NotFoundVoiceGenerateException extends BaseHttpException {
  constructor() {
    super(HttpStatus.NOT_FOUND, 'Not found voice generate', 'NOT_FOUND_VOICE_GENERATE');
  }
}
