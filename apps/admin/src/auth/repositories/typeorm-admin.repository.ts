import { Injectable, Optional } from '@nestjs/common';

import { DataSource, EntityManager, Repository } from 'typeorm';

import { AdminEntity } from '@libs/persistence';

import { Admin } from '../domain';
import { AdminMapper } from '../mappers';

import { AdminRepository } from './admin.repository';

@Injectable()
export class TypeOrmAdminRepository implements AdminRepository {
  private readonly repository: Repository<AdminEntity>;

  constructor(
    private readonly dataSource: DataSource,
    @Optional()
    private readonly em?: EntityManager,
  ) {
    this.repository = (this.dataSource ?? this.em).getRepository(AdminEntity);
  }

  async hasByEmail(email: string): Promise<boolean> {
    return this.repository.existsBy({ email });
  }

  async findOneByEmail(email: string): Promise<Admin | null> {
    const admin = await this.repository.findOneBy({ email });

    return admin ? AdminMapper.toAdmin(admin) : null;
  }

  async insert(params: Pick<Admin, 'email' | 'name' | 'password'>): Promise<Admin> {
    const admin = this.repository.create({
      email: params.email,
      name: params.name,
      password: params.password,
    });

    return AdminMapper.toAdmin(await this.repository.save(admin));
  }
}
