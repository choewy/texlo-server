import { HttpException, HttpStatus } from '@nestjs/common';

import { BaseHttpException } from './base.http.exception';

export class BaseHttpExceptionResponse {
  readonly timestamp = new Date().toISOString();

  constructor(
    readonly statusCode: HttpStatus,
    readonly clientErrorMessage: string,
    readonly systemErrorMessage: string,
    readonly details?: unknown,
    readonly isUnknownError?: boolean,
  ) {}

  public static from(e: BaseHttpException) {
    return new BaseHttpExceptionResponse(e.statusCode, e.clientErrorMessage, e.systemErrorMessage, e.details, false);
  }

  public static fromHttpException(e: HttpException) {
    return new BaseHttpExceptionResponse(e.getStatus(), '요청이 실패하였습니다.', e.message, e.name, true);
  }

  public static fromUnknown(e: unknown) {
    return new BaseHttpExceptionResponse(
      HttpStatus.INTERNAL_SERVER_ERROR,
      '알 수 없는 오류가 발생하였습니다.',
      'UNKNOWN_ERROR',
      e instanceof Error
        ? {
            name: e.name,
            message: e.message,
            cause: e.cause,
          }
        : e,
      true,
    );
  }
}
