import { HttpStatus } from '@nestjs/common';

import { BaseHttpException } from '@libs/http';

export class UploadFailedFileException extends BaseHttpException {
  constructor() {
    super(HttpStatus.INTERNAL_SERVER_ERROR, 'Upload Failed', 'UPLOAD_FAILED');
  }
}
