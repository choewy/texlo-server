import { Injectable } from '@nestjs/common';

import { compare, hash } from 'bcrypt';

import { PasswordHasher } from './password.hasher';

@Injectable()
export class BcryptPasswordHasher implements PasswordHasher {
  hash(password: string): Promise<string> {
    return hash(password, 10);
  }

  compare(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword);
  }
}
