import { User } from '../domain';

export interface UserRepository {
  findOneByIdOrFail(id: string): Promise<User>;
  update(id: string, params: Partial<Pick<User, 'nickname' | 'profileImageUrl'>>): Promise<void>;
}
