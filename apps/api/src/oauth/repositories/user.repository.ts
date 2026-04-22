import { EntityManager } from 'typeorm';

import { User } from '../domain';

export interface UserRepository {
  transaction<T>(run: (em: EntityManager) => Promise<T>): Promise<T>;
  insert(em: EntityManager): Promise<User>;
}
