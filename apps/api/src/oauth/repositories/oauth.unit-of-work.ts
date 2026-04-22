import { OAuthRepository } from './oauth.repository';
import { UserRepository } from './user.repository';

export type OAuthTxRepositories = {
  oauth: OAuthRepository;
  user: UserRepository;
};

export interface OAuthUnitOfWork {
  tx<T>(run: (repositories: OAuthTxRepositories) => Promise<T>): Promise<T>;
}
