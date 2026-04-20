import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { type Response } from 'express';
import { GridFSBucketReadStream } from 'mongodb';

import { BucketService } from './bucket.service';

@ApiTags('Bucket')
@Controller('bucket')
export class BucketController {
  constructor(private readonly bucketService: BucketService) {}

  @Get(':id')
  @ApiOperation({ summary: '파일 스트림 조회' })
  @ApiOkResponse({ type: GridFSBucketReadStream })
  async getFileStream(@Param('id') id: string, @Res() res: Response) {
    const { file, stream } = await this.bucketService.getFileStream(id);

    res.set({
      'Content-Type': file.mimetype,
      'Content-Length': file.length,
      'Content-Disposition': `inline; filename="${file.filename}"`,
      'Cache-Control': `public, max-age=31536000`,
    });

    stream.pipe(res);
  }
}
