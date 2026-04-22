import { EntityManager } from 'typeorm';

import { OAuth, OAuthProfile, User } from '../domain';

export interface OAuthRepository {
  transaction<T>(run: (em: EntityManager) => Promise<T>): Promise<T>;
  findOne(profile: OAuthProfile): Promise<OAuth | null>;
  insert(profile: OAuthProfile, user: User, em: EntityManager): Promise<OAuth>;
  update(id: string, profile: OAuthProfile): Promise<void>;
}
