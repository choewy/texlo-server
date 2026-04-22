import { Injectable, Optional } from '@nestjs/common';

import { DataSource, EntityManager } from 'typeorm';

import { OAuthEntity } from '@libs/persistence';

import { OAuth, OAuthProfile, User } from '../domain';
import { OAuthMapper } from '../mappers';

import { OAuthRepository } from './oauth.repository';

@Injectable()
export class TypeOrmOAuthRepository implements OAuthRepository {
  constructor(
    private readonly dataSource: DataSource,
    @Optional()
    private readonly entityManager?: EntityManager,
  ) {}

  private getRepository() {
    return (this.entityManager ?? this.dataSource).getRepository(OAuthEntity);
  }

  async findOne(profile: OAuthProfile): Promise<OAuth | null> {
    const oauth = await this.getRepository().findOneBy({
      provider: profile.provider,
      providerId: profile.providerId,
    });

    return oauth ? OAuthMapper.toOAuth(oauth) : null;
  }

  async insert(profile: OAuthProfile, user: User): Promise<OAuth> {
    const repository = this.getRepository();
    const oauth = repository.create({
      provider: profile.provider,
      providerId: profile.providerId,
      profile: {
        email: profile.email,
        name: profile.name,
        profileImageUrl: profile.profileImageUrl,
      },
      user,
    });

    return OAuthMapper.toOAuth(await repository.save(oauth));
  }

  async update(id: string, profile: OAuthProfile): Promise<void> {
    await this.getRepository().update(
      { id },
      {
        profile: {
          email: profile.email,
          name: profile.name,
          profileImageUrl: profile.profileImageUrl,
        },
        updatedAt: () => 'NOW()',
      },
    );
  }
}
