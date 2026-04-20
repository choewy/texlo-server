import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { randomUUID } from 'crypto';
import { fileTypeFromBuffer } from 'file-type';
import { Db, GridFSBucket, GridFSBucketReadStream } from 'mongodb';
import { Model } from 'mongoose';

import { FileEntity } from '@libs/persistence';

import { BucketFile } from './domain';
import { InvalidFileTypeException, NotFoundFileException, UploadFailedFileException } from './exceptions';

@Injectable()
export class BucketService {
  constructor(
    @InjectModel(FileEntity.name)
    private readonly fileModel: Model<FileEntity>,
  ) {}

  private get bucket() {
    return new GridFSBucket(this.fileModel.db as unknown as Db);
  }

  async getFileStream(id: string): Promise<{ file: FileEntity; stream: GridFSBucketReadStream }> {
    const file = await this.fileModel.findOne({ 'metadata.id': id });

    if (!file) {
      throw new NotFoundFileException(id);
    }

    const stream = this.bucket.openDownloadStream(file._id);

    return { file, stream };
  }

  async uploadFile(uploadedFile: Express.Multer.File): Promise<BucketFile> {
    const fileType = await fileTypeFromBuffer(uploadedFile.buffer);

    if (!fileType) {
      throw new InvalidFileTypeException();
    }

    const id = `${randomUUID()}.${fileType.ext}`;
    const filename = Buffer.from(uploadedFile.originalname ?? '', 'latin1').toString('utf-8');
    const stream = this.bucket.openUploadStream(filename, {
      metadata: { id, ext: fileType.ext, mimetype: fileType.mime },
    });

    await new Promise<void>((resolve, reject) => {
      stream.end(uploadedFile.buffer);
      stream.on('error', reject);
      stream.on('finish', resolve);
    });

    const file = await this.fileModel.findOne({ 'metadata.id': id });

    if (!file) {
      throw new UploadFailedFileException();
    }

    return new BucketFile(file);
  }

  async removeFile(id: string): Promise<void> {
    const file = await this.fileModel.findOne({ 'metadata.id': id });

    if (!file) {
      throw new NotFoundFileException(id);
    }

    await file.deleteOne();
  }
}
