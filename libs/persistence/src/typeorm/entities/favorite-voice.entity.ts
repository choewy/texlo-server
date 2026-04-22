import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UserEntity } from './user.entity';
import { VoiceEntity } from './voice.entity';

@Entity({ name: 'favorite_voices' })
@Index('FAVORITE_VOICES_UNIQUE_KEY', ['userId', 'voiceId'], { unique: true })
export class FavoriteVoiceEntity {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'FAVORITE_VOICE_PK' })
  id!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ foreignKeyConstraintName: 'FAVORITE_VOICES_USER_FK' })
  user!: UserEntity;

  @Column({ type: 'uuid' })
  voiceId!: string;

  @ManyToOne(() => VoiceEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ foreignKeyConstraintName: 'FAVORITE_VOICES_VOICE_FK' })
  voice!: VoiceEntity;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
