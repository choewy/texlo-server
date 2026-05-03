import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { VideoDownloadPlatform, VideoDownloadStatus } from '@apps/api/shared';

export class VideoDownloadResDTO {
  @ApiProperty({ type: String, format: 'uuid' })
  @Expose()
  id!: string;

  @ApiProperty({ enum: VideoDownloadPlatform })
  @Expose()
  platform!: VideoDownloadPlatform;

  @ApiProperty({ type: String, format: 'uri' })
  @Expose()
  origin!: string;

  @ApiProperty({ type: String, nullable: true })
  @Expose()
  title!: string | null;

  @ApiProperty({ type: String, format: 'uri', nullable: true })
  @Expose()
  url!: string | null;

  @ApiProperty({ type: String, format: 'int64' })
  @Expose()
  size!: string;

  @ApiProperty({ enum: VideoDownloadStatus })
  @Expose()
  status!: VideoDownloadStatus;

  @ApiProperty({ type: Object, nullable: true })
  @Expose()
  error!: object | null;

  @ApiProperty({ type: Date })
  @Expose()
  createdAt!: Date;

  @ApiProperty({ type: Date })
  @Expose()
  updatedAt!: Date;
}
