import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { VoiceProvider, VoiceSyncLockStatus } from '../enums';

import { AdminEntity } from './admin.entity';

@Entity({ name: 'voice_sync_locks' })
export class VoiceSyncLockEntity {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'VOICE_SYNC_LOCKS' })
  id!: string;

  @Column({ type: 'enum', enum: VoiceProvider })
  provider!: VoiceProvider;

  @Column({ type: 'enum', enum: VoiceSyncLockStatus, default: VoiceSyncLockStatus.Pending })
  status!: VoiceSyncLockStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @Column({ type: 'uuid', nullable: true })
  adminId!: string | null;

  @ManyToOne(() => AdminEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ foreignKeyConstraintName: 'VOICE_SYNC_LOCKS_ADMIN_FK' })
  admin!: AdminEntity | null;
}
