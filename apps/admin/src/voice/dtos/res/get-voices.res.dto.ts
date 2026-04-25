import { ApiProperty } from '@nestjs/swagger';

import { Expose, Type } from 'class-transformer';

import { VoiceResDTO } from './voice.res.dto';

export class GetVoicesResDTO {
  @ApiProperty({ type: Number })
  @Expose()
  total!: number;

  @ApiProperty({ type: VoiceResDTO, isArray: true })
  @Type(() => VoiceResDTO)
  @Expose()
  rows!: VoiceResDTO[];
}
