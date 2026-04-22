import { HttpStatus } from '@nestjs/common';

import { BaseHttpException } from '@libs/http';

export class OAuthProviderNotSupportedException extends BaseHttpException {
  constructor(provider: string) {
    super(HttpStatus.UNPROCESSABLE_ENTITY, `OAuth client not found for provider: ${provider}`, 'OAUTH_PROVIDER_NOT_SUPPORTED');
  }
}
