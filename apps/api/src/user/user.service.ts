import { Inject, Injectable } from '@nestjs/common';

import { OAUTH_REPOSITORY, type OAuthRepository, USER_REPOSITORY, type UserRepository } from './repositories';
import { ProfileResult } from './usecases';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(OAUTH_REPOSITORY)
    private readonly oauthRepository: OAuthRepository,
  ) {}

  async getProfile(id: string): Promise<ProfileResult> {
    const user = await this.userRepository.findOneByIdOrFail(id);

    return { nickname: user.nickname, profileImageUrl: user.profileImageUrl };
  }
}
