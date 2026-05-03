import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { VideoDownloadPlatform, VideoDownloadStatus } from '../enums';

import { UserEntity } from './user.entity';

@Entity({ name: 'video_download' })
export class VideoDownloadEntity {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'VIDEO_DOWNLOADS' })
  id!: string;

  @Column({ type: 'enum', enum: VideoDownloadPlatform })
  platform!: VideoDownloadPlatform;

  @Column({ type: 'varchar', length: 1024 })
  origin!: string;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  title!: string | null;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  url!: string | null;

  @Column({ type: 'bigint', default: 0 })
  size!: string;

  @Column({ type: 'enum', enum: VideoDownloadStatus, default: VideoDownloadStatus.Pending })
  status!: VideoDownloadStatus;

  @Column({ type: 'jsonb', nullable: true })
  error!: object | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @Column({ type: 'uuid', nullable: true })
  userId!: string | null;

  @ManyToOne(() => UserEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ foreignKeyConstraintName: 'VIDEO_DOWNLOADS_USER_FK' })
  user!: UserEntity | null;
}
