import { OAuth } from '../domain';

export interface OAuthRepository {
  findByUserId(userId: string): Promise<OAuth[]>;
}
