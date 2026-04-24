import { OAuthProfile, User } from '../domain';

export interface UserRepository {
  insert(profile: OAuthProfile): Promise<User>;
}
