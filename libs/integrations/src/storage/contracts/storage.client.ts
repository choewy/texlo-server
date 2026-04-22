import { StorageFileUploadResult } from '../usecases';

export interface StorageClient {
  uploadFile(file: Express.Multer.File): Promise<StorageFileUploadResult>;
  uploadBuffer(buffer: Buffer, filename?: string): Promise<StorageFileUploadResult>;
}
