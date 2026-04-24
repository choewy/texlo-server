import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { AdminStatus } from '../enums';

@Entity({ name: 'admins' })
@Index('ADMINS_UNIQUE_EMAIL', ['email'], { unique: true })
export class AdminEntity {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'ADMINS_PK' })
  id!: string;

  @Column({ type: 'varchar', length: 340 })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  password!: string;

  @Column({ type: 'varchar', length: 50 })
  name!: string;

  @Column({ type: 'enum', enum: AdminStatus, default: AdminStatus.Pending })
  status!: AdminStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
