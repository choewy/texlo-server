import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsNotEmpty, IsUrl } from 'class-validator';

import { VideoDownloadPlatform } from '@apps/api/shared';

export class DownloadVideoReqDTO {
  @ApiProperty({ enum: VideoDownloadPlatform })
  @IsEnum(VideoDownloadPlatform)
  @IsNotEmpty()
  readonly platform!: VideoDownloadPlatform;

  @ApiProperty({ type: String, format: 'uri' })
  @IsUrl()
  @IsNotEmpty()
  readonly origin!: string;
}
