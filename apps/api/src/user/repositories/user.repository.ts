import { User } from '../domain';

export interface UserRepository {
  findOneByIdOrFail(id: string): Promise<User>;
}
