import { HttpStatus } from '@nestjs/common';

import { BaseHttpException } from '@libs/http';

export class AdminNotApprovedException extends BaseHttpException {
  constructor() {
    super(HttpStatus.FORBIDDEN, 'Admin account is not approved', 'ADMIN_NOT_APPROVED');
  }
}
