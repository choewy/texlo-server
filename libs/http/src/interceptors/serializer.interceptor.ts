import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';

@Injectable()
export class SerializerInterceptor implements NestInterceptor {
  constructor(private readonly dto: new (...args: unknown[]) => unknown) {}

  intercept(_: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((data) => {
        return Array.isArray(data)
          ? data.map((item) =>
              plainToInstance(this.dto, item, {
                excludeExtraneousValues: true,
                enableImplicitConversion: true,
                enableCircularCheck: true,
                excludePrefixes: ['__'],
              }),
            )
          : plainToInstance(this.dto, data, {
              excludeExtraneousValues: true,
              enableImplicitConversion: true,
              enableCircularCheck: true,
              excludePrefixes: ['__'],
            });
      }),
    );
  }
}
