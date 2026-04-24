import { AdminEntity } from '@libs/persistence';

import { Admin } from '../domain';

export class AdminMapper {
  static toAdmin(entity: AdminEntity): Admin {
    const admin = new Admin();

    admin.id = entity.id;
    admin.name = entity.name;
    admin.email = entity.email;
    admin.password = entity.password;
    admin.status = entity.status;

    return admin;
  }
}
