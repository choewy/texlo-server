import { ApiProperty } from '@nestjs/swagger';

import { Expose, Type } from 'class-transformer';

import { VideoDownloadResDTO } from './video-download.res.dto';

export class GetVideoDownloadsResDTO {
  @ApiProperty({ type: Number })
  @Expose()
  total!: number;

  @ApiProperty({ type: VideoDownloadResDTO })
  @Type(() => VideoDownloadResDTO)
  @Expose()
  rows!: VideoDownloadResDTO[];
}
