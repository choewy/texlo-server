import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsUUID, MinLength } from 'class-validator';

export class GenerateVoiceReqDTO {
  @ApiProperty({ type: String, format: 'uuid' })
  @IsUUID('4')
  @IsNotEmpty()
  readonly voiceId!: string;

  @ApiProperty({ type: String })
  @MinLength(1)
  @IsNotEmpty()
  readonly text!: string;
}
