import { HttpStatus } from '@nestjs/common';

import { ValidationError } from 'class-validator';

import { BaseHttpException } from './base.http.exception';

type ValidationDetail = {
  field: string;
  messages: string[];
};

function flattenValidationErrors(errors: ValidationError[], parentPath = ''): ValidationDetail[] {
  const result: ValidationDetail[] = [];

  for (const e of errors) {
    const path = parentPath ? `${parentPath}.${e.property}` : e.property;

    if (e.constraints) {
      result.push({
        field: path,
        messages: Object.values(e.constraints),
      });
    }

    if (e.children && e.children.length > 0) {
      result.push(...flattenValidationErrors(e.children, path));
    }
  }

  return result;
}

export class ValidationException extends BaseHttpException {
  constructor(errors: ValidationError[]) {
    super(HttpStatus.BAD_REQUEST, '올바르지 않은 요청 형식입니다.', 'VALIDATION_FAILED', flattenValidationErrors(errors));
  }
}
