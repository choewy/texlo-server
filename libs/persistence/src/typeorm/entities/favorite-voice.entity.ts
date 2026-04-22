import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { UserEntity } from './user.entity';
import { VoiceEntity } from './voice.entity';

@Entity({ name: 'favorite_voices' })
@Unique('FAVORITE_VOICES_UNIQUE_KEY', ['userId', 'voiceId'])
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
