import { Injectable } from '@nestjs/common';

import { DataSource, EntityManager } from 'typeorm';

import { UserEntity } from '@libs/persistence';

import { User } from '../domain';
import { OAuthMapper } from '../mappers';

import { UserRepository } from './user.repository';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(private readonly dataSource: DataSource) {}

  private getRepository(em?: EntityManager) {
    return (em ?? this.dataSource).getRepository(UserEntity);
  }

  transaction<T>(run: (em: EntityManager) => Promise<T>): Promise<T> {
    return this.dataSource.transaction(run);
  }

  async insert(em: EntityManager): Promise<User> {
    const repository = this.getRepository(em);
    const user = repository.create({});

    return OAuthMapper.toUser(await repository.save(user));
  }
}
