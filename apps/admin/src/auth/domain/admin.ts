import { AdminStatus } from '../../shared';

export class Admin {
  id!: string;
  email!: string;
  password!: string;
  name!: string;
  status!: AdminStatus;
}
