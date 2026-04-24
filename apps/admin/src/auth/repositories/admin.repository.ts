import { Admin } from '../domain';

export interface AdminRepository {
  hasByEmail(email: string): Promise<boolean>;
  findOneByEmail(email: string): Promise<Admin | null>;
  insert(params: Pick<Admin, 'email' | 'name' | 'password'>): Promise<Admin>;
}
