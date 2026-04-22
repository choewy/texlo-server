import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { OAuthProvider } from '../enums';

import { UserEntity } from './user.entity';

@Entity({ name: 'oauths' })
@Index('OAUTHS_UNIQUE_PROVIDER_ID', ['provider', 'providerId'], { unique: true })
@Index('OAUTHS_USER_ID_IDX', ['userId'])
export class OAuthEntity {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'OAUTHS_PK' })
  id!: string;

  @Column({ type: 'enum', enum: OAuthProvider })
  provider!: OAuthProvider;

  @Column({ type: 'varchar', length: 50 })
  providerId!: string;

  @Column({ type: 'jsonb' })
  profile!: object;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @Column({ type: 'uuid' })
  userId!: string;

  @ManyToOne(() => UserEntity, (e) => e.oauths, { onDelete: 'CASCADE' })
  @JoinColumn({ foreignKeyConstraintName: 'OAUTHS_USER_FK' })
  user!: UserEntity;
}
