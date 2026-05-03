import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { randomUUID } from 'node:crypto';
import { Readable, Writable } from 'node:stream';
import mimeTypes from 'mime-types';
import { Db, GridFSBucket, GridFSBucketReadStream } from 'mongodb';
import { Model } from 'mongoose';

import { File } from '@libs/persistence';
import { FileDescriptor } from '@libs/utils';

import { BucketFile } from './domain';
import { NotFoundFileException, UploadFailedFileException } from './exceptions';
import { BucketMapper } from './mappers';

@Injectable()
export class BucketService {
  constructor(
    @InjectModel(File.name)
    private readonly fileModel: Model<File>,
  ) {}

  private get bucket() {
    return new GridFSBucket(this.fileModel.db as unknown as Db);
  }

  private normalizeMimeType(mimetype?: string): string | undefined {
    return mimetype?.split(';')[0]?.trim() || undefined;
  }

  private async resolveFileType(buffer: Buffer, filename?: string, mimetype?: string) {
    try {
      return await FileDescriptor.fromBuffer(buffer, filename);
    } catch (e) {
      const mime = this.normalizeMimeType(mimetype);
      const ext = mime ? mimeTypes.extension(mime) : undefined;

      if (mime && ext) {
        return { ext, mime };
      }

      throw e;
    }
  }

  private async writeChunk(stream: Writable, chunk: Buffer) {
    if (stream.write(chunk)) {
      return;
    }

    await new Promise<void>((resolve, reject) => {
      const onDrain = () => {
        cleanup();
        resolve();
      };

      const onError = (error: Error) => {
        cleanup();
        reject(error);
      };

      const cleanup = () => {
        stream.off('drain', onDrain);
        stream.off('error', onError);
      };

      stream.once('drain', onDrain);
      stream.once('error', onError);
    });
  }

  private waitForUpload(stream: Writable) {
    return new Promise<void>((resolve, reject) => {
      const onFinish = () => {
        cleanup();
        resolve();
      };

      const onError = (error: Error) => {
        cleanup();
        reject(error);
      };

      const cleanup = () => {
        stream.off('finish', onFinish);
        stream.off('error', onError);
      };

      stream.once('finish', onFinish);
      stream.once('error', onError);
    });
  }

  private toBuffer(chunk: unknown): Buffer<ArrayBufferLike> {
    if (Buffer.isBuffer(chunk)) {
      return chunk;
    }

    if (typeof chunk === 'string') {
      return Buffer.from(chunk);
    }

    if (chunk instanceof ArrayBuffer) {
      return Buffer.from(chunk);
    }

    if (ArrayBuffer.isView(chunk)) {
      return Buffer.from(chunk.buffer, chunk.byteOffset, chunk.byteLength);
    }

    return Buffer.from(String(chunk));
  }

  async getFileStream(id: string): Promise<{ file: File; stream: GridFSBucketReadStream }> {
    const file = await this.fileModel.findOne({ 'metadata.id': id });

    if (!file) {
      throw new NotFoundFileException(id);
    }

    const stream = this.bucket.openDownloadStream(file._id);

    return { file, stream };
  }

  async uploadFile(uploadedFile: Express.Multer.File): Promise<BucketFile> {
    const fileType = await FileDescriptor.fromFile(uploadedFile);
    const id = `${randomUUID()}.${fileType.ext}`;
    const filename = Buffer.from(uploadedFile.originalname ?? '', 'latin1').toString('utf-8');
    const stream = this.bucket.openUploadStream(filename, {
      metadata: { id, ext: fileType.ext, mimetype: fileType.mime },
    });

    await new Promise<void>((resolve, reject) => {
      stream.end(uploadedFile.buffer);
      stream.once('error', reject);
      stream.once('finish', resolve);
    });

    const file = await this.fileModel.findOne({ 'metadata.id': id });

    if (!file) {
      throw new UploadFailedFileException();
    }

    return BucketMapper.toFile(file);
  }

  async uploadFileStream(input: Readable, options: { filename?: string; mimetype?: string }): Promise<BucketFile> {
    const fileTypeSize = 4100;

    const iterator = input[Symbol.asyncIterator]();
    const sampleChunks: Buffer[] = [];

    let sampleSize = 0;
    let stream: Writable | undefined;
    let finishied: Promise<void> | undefined;
    let id: string | undefined;

    try {
      while (sampleSize < fileTypeSize) {
        const next = await iterator.next();

        if (next.done) {
          break;
        }

        const chunk = this.toBuffer(next.value);
        sampleChunks.push(chunk);
        sampleSize += chunk.byteLength;
      }

      const sample = Buffer.concat(sampleChunks, sampleSize);
      const fileType = await this.resolveFileType(sample.subarray(0, fileTypeSize), options.filename, options.mimetype);

      id = `${randomUUID()}.${fileType.ext}`;

      const filename = Buffer.from(options.filename ?? id, 'latin1').toString('utf-8');
      const metadata = { id, ext: fileType.ext, mimetype: fileType.mime };

      stream = this.bucket.openUploadStream(filename, { metadata });
      finishied = this.waitForUpload(stream);

      for (const chunk of sampleChunks) {
        await this.writeChunk(stream, chunk);
      }

      for await (const chunk of { [Symbol.asyncIterator]: () => iterator }) {
        await this.writeChunk(stream, this.toBuffer(chunk));
      }

      stream.end();

      await finishied;
      const file = await this.fileModel.findOne({ 'metadata.id': id });

      if (!file) {
        throw new UploadFailedFileException();
      }

      return BucketMapper.toFile(file);
    } catch (e) {
      if (stream) {
        stream.destroy(e instanceof Error ? e : undefined);
      }

      if (finishied) {
        await finishied.catch(() => undefined);
      }

      throw e;
    }
  }

  async removeFile(id: string): Promise<void> {
    const file = await this.fileModel.findOne({ 'metadata.id': id });

    if (file) {
      await file.deleteOne();
    }
  }
}
