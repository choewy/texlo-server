import { applyDecorators, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { SerializerInterceptor } from './serializer.interceptor';

export function Serializer(DTO: new (...args: unknown[]) => unknown) {
  return applyDecorators(UseInterceptors(new SerializerInterceptor(DTO), new ClassSerializerInterceptor(new Reflector())));
}
