import { Injectable, Optional } from '@nestjs/common';

import { DataSource, EntityManager } from 'typeorm';

import { OAuthEntity } from '@libs/persistence';

import { OAuth } from '../domain';
import { UserMapper } from '../mappers';

import { OAuthRepository } from './oauth.repository';

@Injectable()
export class TypeOrmOAuthRepository implements OAuthRepository {
  constructor(
    private readonly dataSource: DataSource,
    @Optional()
    private readonly em?: EntityManager,
  ) {}

  private getRepository() {
    return (this.em ?? this.dataSource).getRepository(OAuthEntity);
  }

  async findByUserId(userId: string): Promise<OAuth[]> {
    const oauths = await this.getRepository().findBy({ userId });

    return oauths.map((oauth) => UserMapper.toOAuth(oauth));
  }
}
