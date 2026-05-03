import { ApiProperty } from '@nestjs/swagger';

import { Expose, Transform, Type } from 'class-transformer';

import { VoiceGenerateStatus } from '@apps/api/shared';

import { VoiceResDTO } from './voice.res.dto';

export class VoiceGenerateResDTO {
  @ApiProperty({ type: String, format: 'uuid' })
  @Expose()
  id!: string;

  @ApiProperty({ enum: VoiceGenerateStatus })
  @Expose()
  status!: VoiceGenerateStatus;

  @ApiProperty({ type: String, format: 'uri' })
  @Expose()
  url!: string | null;

  @ApiProperty({ type: String })
  @Expose()
  text!: string;

  @ApiProperty({ type: String, format: 'int64' })
  @Expose()
  size!: string;

  @ApiProperty({ type: Object, nullable: true })
  @Transform(({ obj, key }) => {
    return (obj as object)[key as keyof object] ?? null;
  })
  @Expose()
  error!: object | null;

  @ApiProperty({ type: Date })
  @Expose()
  createdAt!: Date;

  @ApiProperty({ type: Date })
  @Expose()
  updatedAt!: Date;

  @ApiProperty({ type: VoiceResDTO, nullable: true })
  @Type(() => VoiceResDTO)
  @Expose()
  voice!: VoiceResDTO | null;
}
