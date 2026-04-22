import { HttpStatus } from '@nestjs/common';

import { AxiosError } from 'axios';

import { BaseHttpException } from '@libs/http';

export class OAuthTokenExchangeFailedException extends BaseHttpException {
  constructor(provider: string, e?: unknown) {
    super(
      e instanceof AxiosError ? (e.response?.status ?? HttpStatus.BAD_GATEWAY) : HttpStatus.UNAUTHORIZED,
      `Failed to exchange OAuth code for access token (provider: ${provider})`,
      'OAUTH_TOKEN_EXCHANGE_FAILED',
      e instanceof AxiosError ? e.response?.data : e instanceof Error ? { name: e.name, message: e.message } : e,
    );
  }
}
