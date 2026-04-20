import { Controller, Get, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { type Response } from 'express';
import { GridFSBucketReadStream } from 'mongodb';

import { Serializer } from '@libs/http';

import { BucketService } from './bucket.service';
import { UploadFileReqDTO, UploadFileResDTO } from './dtos';
import { BucketGuard } from './guards';

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
      'Content-Type': file.metadata.mimetype,
      'Content-Length': file.length,
      'Content-Disposition': `inline; filename="${id}"`,
      'Cache-Control': `public, max-age=31536000`,
    });

    stream.pipe(res);
  }

  @Post()
  @Serializer(UploadFileResDTO)
  @UseGuards(BucketGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: '파일 업로드' })
  @ApiBody({ type: UploadFileReqDTO })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ type: UploadFileResDTO })
  async uploadFile(@UploadedFile() uploadedFile: Express.Multer.File) {
    return this.bucketService.uploadFile(uploadedFile);
  }
}
