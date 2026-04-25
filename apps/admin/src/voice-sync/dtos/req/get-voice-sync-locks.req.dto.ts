import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsEnum, IsOptional, Max, Min } from 'class-validator';

import { VoiceProvider } from '@apps/admin/shared';

export class GetVoiceSyncLocksReqDTO {
  @ApiPropertyOptional({ enum: VoiceProvider })
  @IsEnum(VoiceProvider)
  @IsOptional()
  readonly provider?: VoiceProvider;

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
