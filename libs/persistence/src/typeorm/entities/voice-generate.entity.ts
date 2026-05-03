import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { VoiceGenerateStatus } from '../enums';

import { UserEntity } from './user.entity';
import { VoiceEntity } from './voice.entity';

@Entity({ name: 'voice_generates' })
export class VoiceGenerateEntity {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'VOICE_GENERATES' })
  id!: string;

  @Column({ type: 'enum', enum: VoiceGenerateStatus, default: VoiceGenerateStatus.Pending })
  status!: VoiceGenerateStatus;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  url!: string | null;

  @Column({ type: 'text' })
  text!: string;

  @Column({ type: 'bigint', default: 0 })
  size!: string;

  @Column({ type: 'jsonb', nullable: true })
  error!: object | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @Column({ type: 'uuid', nullable: true })
  userId!: string | null;

  @ManyToOne(() => UserEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ foreignKeyConstraintName: 'VOICE_GENERATES_USER_FK' })
  user!: UserEntity | null;

  @Column({ type: 'uuid', nullable: true })
  voiceId!: string | null;

  @ManyToOne(() => VoiceEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ foreignKeyConstraintName: 'VOICE_GENERATES_VOICE_FK' })
  voice!: VoiceEntity | null;
}
