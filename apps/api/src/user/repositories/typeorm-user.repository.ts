import { Injectable, Optional } from '@nestjs/common';

import { DataSource, EntityManager } from 'typeorm';

import { UserEntity } from '@libs/persistence';

import { User } from '../domain';
import { UserMapper } from '../mappers';

import { UserRepository } from './user.repository';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(
    private readonly dataSource: DataSource,
    @Optional()
    private readonly em?: EntityManager,
  ) {}

  private getRepository() {
    return (this.em ?? this.dataSource).getRepository(UserEntity);
  }

  async findOneByIdOrFail(id: string): Promise<User> {
    return UserMapper.toUser(await this.getRepository().findOneByOrFail({ id }));
  }
}
