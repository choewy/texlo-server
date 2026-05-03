import { HttpStatus } from '@nestjs/common';

import { BaseHttpException } from '@libs/http';

export class UnsupportedVideoDownloadPlatformException extends BaseHttpException {
  constructor() {
    super(HttpStatus.BAD_REQUEST, 'Unsupported video download platform', 'UNSUPPORTED_VIDEO_DOWNLOAD_PLATFORM');
  }
}
