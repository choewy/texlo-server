import { ApiProperty } from '@nestjs/swagger';

import { IsOptional } from 'class-validator';

export class UpdateProfileImageReqDTO {
  @ApiProperty({ type: 'string', format: 'binary' })
  @IsOptional()
  readonly image!: string;
}
