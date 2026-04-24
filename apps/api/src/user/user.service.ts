import { Inject, Injectable } from '@nestjs/common';

import { OAuth } from './domain';
import { OAUTH_REPOSITORY, type OAuthRepository, USER_REPOSITORY, type UserRepository } from './repositories';
import { GetOAuthsInput, GetProfileInput, GetProfileResult } from './usecases';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(OAUTH_REPOSITORY)
    private readonly oauthRepository: OAuthRepository,
  ) {}

  async getProfile(input: GetProfileInput): Promise<GetProfileResult> {
    const [user, oauth] = await Promise.all([this.userRepository.findOneByIdOrFail(input.id), this.oauthRepository.findOneByIdOrFail(input.oauthId)]);

    return { ...user, oauth };
  }

  async getOAuths(input: GetOAuthsInput): Promise<OAuth[]> {
    return this.oauthRepository.findByUserId(input.id);
  }
}
