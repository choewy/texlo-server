import { HttpStatus } from '@nestjs/common';

import { BaseHttpException } from '@libs/http';

export class ActiveVoiceSyncAlreadyExistsException extends BaseHttpException {
  constructor() {
    super(HttpStatus.CONFLICT, 'Active voice sync already exists', 'ACTIVE_VOICE_SYNC_ALREADY_EXISTS');
  }
}
