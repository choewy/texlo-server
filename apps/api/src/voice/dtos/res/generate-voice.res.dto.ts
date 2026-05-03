import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

export class GenerateVoiceResDTO {
  @ApiProperty({ type: String, format: 'uuid' })
  @Expose()
  id!: string;
}
