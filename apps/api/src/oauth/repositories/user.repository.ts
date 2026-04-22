import { User } from '../domain';

export interface UserRepository {
  insert(): Promise<User>;
}
