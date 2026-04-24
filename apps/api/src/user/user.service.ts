import { Inject, Injectable } from '@nestjs/common';

import { STORAGE_CLIENT, type StorageClient } from '@libs/integrations';

import { OAuth } from './domain';
import { OAUTH_REPOSITORY, type OAuthRepository, USER_REPOSITORY, type UserRepository } from './repositories';
import { GetOAuthsInput, GetProfileInput, GetProfileResult, UpdateProfileInput } from './usecases';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(OAUTH_REPOSITORY)
    private readonly oauthRepository: OAuthRepository,
    @Inject(STORAGE_CLIENT)
    private readonly storageClient: StorageClient,
  ) {}

  async getProfile(input: GetProfileInput): Promise<GetProfileResult> {
    const [user, oauth] = await Promise.all([this.userRepository.findOneByIdOrFail(input.id), this.oauthRepository.findOneByIdOrFail(input.oauthId)]);

    return { ...user, oauth };
  }

  async getOAuths(input: GetOAuthsInput): Promise<OAuth[]> {
    return this.oauthRepository.findByUserId(input.id);
  }

  async updateProfile(id: string, input: UpdateProfileInput): Promise<void> {
    await this.userRepository.update(id, input);
  }

  async updateProfileImage(id: string, file: Express.Multer.File): Promise<void> {
    const user = await this.userRepository.findOneByIdOrFail(id);

    const uploadResult = await this.storageClient.uploadFile(file);
    await this.userRepository.update(id, { profileImageUrl: uploadResult.url });
    await this.storageClient.remove(user.profileImageUrl ?? '');
  }
}
