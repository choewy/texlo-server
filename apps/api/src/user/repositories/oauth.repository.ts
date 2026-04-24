import { OAuth } from '../domain';

export interface OAuthRepository {
  findOneByIdOrFail(userId: string): Promise<OAuth>;
  findByUserId(userId: string): Promise<OAuth[]>;
}
