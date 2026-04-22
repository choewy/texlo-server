import { StorageFileUploadResult } from '../types';

export interface StorageClient {
  uploadFile(file: Express.Multer.File): Promise<StorageFileUploadResult>;
  uploadBuffer(buffer: Buffer, filename?: string): Promise<StorageFileUploadResult>;
}
