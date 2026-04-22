import { instanceToPlain } from 'class-transformer';

export class JwtClaims {
  constructor(readonly id: string) {}

  toObject() {
    return instanceToPlain(this);
  }
}
