import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsEnum, IsOptional, Max, Min } from 'class-validator';

import { VideoDownloadPlatform, VideoDownloadStatus } from '@apps/api/shared';

export class GetVideoDownloadsReqDTO {
  @ApiPropertyOptional({ enum: VideoDownloadPlatform })
  @IsEnum(VideoDownloadPlatform)
  @IsOptional()
  readonly platform?: VideoDownloadPlatform;

  @ApiPropertyOptional({ enum: VideoDownloadStatus })
  @IsEnum(VideoDownloadStatus)
  @IsOptional()
  readonly status?: VideoDownloadStatus;

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
