import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsEnum, IsOptional, Max, Min } from 'class-validator';

import { VoiceAge, VoiceGender, VoiceLanguage } from '@apps/api/shared';

export class GetVoicesReqDTO {
  @ApiPropertyOptional({ enum: VoiceAge })
  @IsEnum(VoiceAge)
  @IsOptional()
  readonly age?: VoiceAge;

  @ApiPropertyOptional({ enum: VoiceGender })
  @IsEnum(VoiceGender)
  @IsOptional()
  readonly gender?: VoiceGender;

  @ApiPropertyOptional({ enum: VoiceLanguage })
  @IsEnum(VoiceLanguage)
  @IsOptional()
  readonly language?: VoiceLanguage;

  @ApiPropertyOptional({ enum: ['true', 'false'] })
  @IsEnum(['true', 'false'])
  @IsOptional()
  readonly favorite?: 'true' | 'false';

  @ApiPropertyOptional({ type: Number })
  @Min(1)
  @IsOptional()
  readonly page: number = 1;

  @ApiPropertyOptional({ type: Number })
  @Min(1)
  @Max(100)
  @IsOptional()
  readonly take: number = 20;
}
