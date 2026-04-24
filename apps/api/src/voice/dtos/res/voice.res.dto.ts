import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { VoiceAge, VoiceGender, VoiceLanguage, VoiceProvider } from '@apps/api/shared';

export class VoiceResDTO {
  @ApiProperty({ type: String, format: 'uuid' })
  @Expose()
  id!: string;

  @ApiProperty({ enum: VoiceProvider })
  @Expose()
  provider!: VoiceProvider;

  @ApiProperty({ type: String })
  @Expose()
  name!: string;

  @ApiProperty({ type: String, nullable: true })
  @Expose()
  imageUrl!: string | null;

  @Expose()
  soundUrl!: string | null;

  @ApiProperty({ enum: VoiceGender, nullable: true })
  @Expose()
  gender!: VoiceGender | null;

  @ApiProperty({ enum: VoiceAge, nullable: true })
  @Expose()
  age!: VoiceAge | null;

  @ApiProperty({ enum: VoiceLanguage, isArray: true })
  @Expose()
  languages!: VoiceLanguage[];

  @ApiProperty({ type: String, isArray: true })
  @Expose()
  styles!: string[];

  @ApiProperty({ type: String, isArray: true })
  @Expose()
  usecases!: string[];

  @ApiProperty({ type: Number })
  @Expose()
  likes!: number;

  @ApiProperty({ type: Boolean })
  @Expose()
  favorite!: boolean;
}
