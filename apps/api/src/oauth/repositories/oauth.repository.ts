import { OAuth, OAuthProfile, User } from '../domain';

export interface OAuthRepository {
  findOne(profile: OAuthProfile): Promise<OAuth | null>;
  insert(profile: OAuthProfile, user: User): Promise<OAuth>;
  update(id: string, profile: OAuthProfile): Promise<void>;
}
