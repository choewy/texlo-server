import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { VoiceAge, VoiceGender, VoiceLanguage, VoiceProvider, VoiceStatus } from '../enums';

import { FavoriteVoiceEntity } from './favorite-voice.entity';

@Entity({ name: 'voices' })
@Index('VOICES_UNIQUE_PROVIDER_CODE', ['provider', 'code'], { unique: true })
@Index('VOICES_SEARCH_IDX', ['createdAt', 'id'])
export class VoiceEntity {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'VOICES_PK' })
  id!: string;

  @Column({ type: 'enum', enum: VoiceProvider })
  provider!: VoiceProvider;

  @Column({ type: 'varchar', length: 50 })
  code!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 1024, default: null })
  imageUrl!: string | null;

  @Column({ type: 'varchar', length: 1024, default: null })
  soundUrl!: string | null;

  @Column({ type: 'enum', enum: VoiceGender, default: null })
  gender!: VoiceGender | null;

  @Column({ type: 'enum', enum: VoiceAge, default: null })
  age!: VoiceAge | null;

  @Column({ type: 'enum', enum: VoiceLanguage, array: true, default: [] })
  languages!: VoiceLanguage[];

  @Column({ type: 'varchar', length: 30, array: true, default: [] })
  models!: string[];

  @Column({ type: 'varchar', length: 30, array: true, default: [] })
  styles!: string[];

  @Column({ type: 'varchar', length: 30, array: true, default: [] })
  usecases!: string[];

  @Column({ type: 'bigint', default: 0 })
  likes!: number;

  @Column({ type: 'enum', enum: VoiceStatus, default: VoiceStatus.Activated })
  status!: VoiceStatus;

  @OneToMany(() => FavoriteVoiceEntity, (e) => e.voice, { cascade: true })
  favorites!: FavoriteVoiceEntity[];

  @OneToMany(() => FavoriteVoiceEntity, (e) => e.voice, { cascade: true })
  favorite!: FavoriteVoiceEntity;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
