import { OAuthRepository } from './oauth.repository';
import { UserRepository } from './user.repository';

export type OAuthTxRepositories = {
  oauthRepository: OAuthRepository;
  userRepository: UserRepository;
};

export interface OAuthUnitOfWork {
  transaction<T>(run: (repositories: OAuthTxRepositories) => Promise<T>): Promise<T>;
}
