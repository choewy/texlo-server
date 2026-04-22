import { ApiProperty } from '@nestjs/swagger';

export class OAuthProcessResDTO {
  @ApiProperty({ type: String, nullable: true })
  authToken?: string;

  @ApiProperty({ type: String, nullable: true })
  error?: string;
}
