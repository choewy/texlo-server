import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';

import { IsOptional } from 'class-validator';

class GoogleOAuthProcessReqDTO {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  readonly state!: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  readonly code!: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  readonly scope!: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  readonly prompt!: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  readonly authuser!: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  readonly iss?: string;
}

export class OAuthProcessReqDTO extends IntersectionType(GoogleOAuthProcessReqDTO) {}
