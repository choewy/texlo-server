import { StorageFileUploadResult } from '../types';

export interface StorageClient {
  is(url: string): boolean;
  uploadFile(file: Express.Multer.File): Promise<StorageFileUploadResult>;
  uploadBuffer(buffer: Buffer, filename?: string): Promise<StorageFileUploadResult>;
  uploadUrl(url: string, filename?: string): Promise<StorageFileUploadResult>;
  remove(url: string): Promise<void>;
}
