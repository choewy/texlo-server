import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';

import { Response } from 'express';

import { BaseHttpException, BaseHttpExceptionResponse } from '../exceptions';

@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger();

  catch(e: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    let exception: BaseHttpExceptionResponse;

    switch (true) {
      case e instanceof BaseHttpException:
        exception = BaseHttpExceptionResponse.from(e);
        break;

      case e instanceof HttpException:
        exception = BaseHttpExceptionResponse.fromHttpException(e);
        break;

      default:
        exception = BaseHttpExceptionResponse.fromUnknown(e);
        this.logger.error(e);
    }

    res.status(exception.statusCode).json(exception);
  }
}
