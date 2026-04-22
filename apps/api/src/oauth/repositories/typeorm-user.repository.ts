import { Injectable, Optional } from '@nestjs/common';

import { DataSource, EntityManager } from 'typeorm';

import { UserEntity } from '@libs/persistence';

import { User } from '../domain';
import { OAuthMapper } from '../mappers';

import { UserRepository } from './user.repository';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(
    private readonly dataSource: DataSource,
    @Optional()
    private readonly entityManager?: EntityManager,
  ) {}

  private getRepository() {
    return (this.entityManager ?? this.dataSource).getRepository(UserEntity);
  }

  async insert(): Promise<User> {
    const repository = this.getRepository();
    const user = repository.create({});

    return OAuthMapper.toUser(await repository.save(user));
  }
}
