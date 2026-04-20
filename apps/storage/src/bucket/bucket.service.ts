import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Db, GridFSBucket, GridFSBucketReadStream } from 'mongodb';
import { Model, Types } from 'mongoose';

import { File } from '@libs/persistence';

import { NotFoundFileException } from './exceptions';

@Injectable()
export class BucketService {
  constructor(
    @InjectModel(File.name)
    private readonly fileModel: Model<File>,
  ) {}

  private get bucket() {
    return new GridFSBucket(this.fileModel.db as unknown as Db);
  }

  async getFileStream(id: string): Promise<{ file: File; stream: GridFSBucketReadStream }> {
    const _id = new Types.ObjectId(id);
    const file = await this.fileModel.findOne({ _id });

    if (!file) {
      throw new NotFoundFileException(_id);
    }

    const stream = this.bucket.openDownloadStream(_id);

    return { file, stream };
  }
}
