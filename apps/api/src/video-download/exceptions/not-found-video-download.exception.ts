import { HttpStatus } from '@nestjs/common';

import { BaseHttpException } from '@libs/http';

export class NotFoundVideoDownloadException extends BaseHttpException {
  constructor() {
    super(HttpStatus.NOT_FOUND, 'Not found video download', 'NOT_FOUND_VIDEO_DOWNLOAD');
  }
}
