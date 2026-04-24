import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { OAuthEntity } from './oauth.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'USERS_PK' })
  readonly id!: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  nickname!: string;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  profileImageUrl!: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @OneToMany(() => OAuthEntity, (e) => e.user, { cascade: ['insert', 'remove'] })
  oauths!: OAuthEntity;
}
