import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsUUID } from 'class-validator';

export class IssueTokenReqDTO {
  @ApiProperty({ type: String })
  @IsUUID(4)
  @IsNotEmpty()
  readonly authToken!: string;
}
