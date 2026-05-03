import { Readable } from 'node:stream';

import { StorageFileUploadResult, StorageFileUploadStreamOptions } from '../types';

export interface StorageClient {
  is(url: string): boolean;
  uploadFile(file: Express.Multer.File | string): Promise<StorageFileUploadResult>;
  uploadFilePath(path: string): Promise<StorageFileUploadResult>;
  uploadBuffer(buffer: Buffer, filename?: string): Promise<StorageFileUploadResult>;
  uploadStream(stream: Readable, options?: StorageFileUploadStreamOptions): Promise<StorageFileUploadResult>;
  uploadUrl(url: string, filename?: string): Promise<StorageFileUploadResult>;
  remove(url: string): Promise<void>;
}
