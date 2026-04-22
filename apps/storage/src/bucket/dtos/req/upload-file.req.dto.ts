import { ApiProperty } from '@nestjs/swagger';

import { IsOptional } from 'class-validator';

export class UploadFileReqDTO {
  @ApiProperty({ type: 'string', format: 'binary' })
  @IsOptional()
  readonly file!: string;
}
