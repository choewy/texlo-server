import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Serializer } from '@libs/http';

import { CONTEXT_SERVICE, type ContextService } from '../common';

import { DownloadVideoReqDTO, DownloadVideoResDTO, GetVideoDownloadsReqDTO, GetVideoDownloadsResDTO } from './dtos';
import { VideoDownloadService } from './video-download.service';

@ApiTags('동영상 다운로드')
@Controller('video-download')
export class VideoDownloadController {
  constructor(
    @Inject(CONTEXT_SERVICE)
    private readonly contextService: ContextService,
    private readonly videoDownloadService: VideoDownloadService,
  ) {}

  @Get()
  @Serializer(GetVideoDownloadsResDTO)
  @ApiOperation({ summary: '동영상 다운로드 현황 조회' })
  @ApiOkResponse({ type: GetVideoDownloadsResDTO })
  async getVideoDownloads(@Query() query: GetVideoDownloadsReqDTO) {
    return this.videoDownloadService.getVideoDownloads({
      userId: this.contextService.user.id,
      platform: query.platform,
      status: query.status,
      page: query.page,
      take: query.take,
    });
  }

  @Post()
  @Serializer(DownloadVideoResDTO)
  @ApiOperation({ summary: '동영상 다운로드' })
  @ApiCreatedResponse({ type: DownloadVideoResDTO })
  async downloadVideo(@Body() body: DownloadVideoReqDTO) {
    return this.videoDownloadService.downloadVideo({
      userId: this.contextService.user.id,
      platform: body.platform,
      origin: body.origin,
    });
  }
}
