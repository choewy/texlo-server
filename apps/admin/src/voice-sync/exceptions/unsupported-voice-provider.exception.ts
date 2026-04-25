import { HttpStatus } from '@nestjs/common';

import { BaseHttpException } from '@libs/http';

export class UnsupportedVoiceProviderException extends BaseHttpException {
  constructor() {
    super(HttpStatus.BAD_REQUEST, 'Unsupported voice provider', 'UNSUPPORTED_VOICE_PROVIDER');
  }
}
