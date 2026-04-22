import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsUrl } from 'class-validator';

export class OAuthLoginReqDTO {
  @ApiProperty({ type: String, format: 'uri' })
  @IsUrl({
    require_tld: false,
    require_port: false,
  })
  @IsNotEmpty()
  readonly redirectURL!: string;
}
