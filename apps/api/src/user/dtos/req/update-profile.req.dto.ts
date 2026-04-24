import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty } from 'class-validator';

export class UpdateProfileReqDTO {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  readonly nickname!: string;
}
