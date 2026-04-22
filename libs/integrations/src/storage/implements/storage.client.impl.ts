import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';

import { lastValueFrom } from 'rxjs';

import { FileDescriptor } from '@libs/utils';

import { StorageClient } from '../contracts';
import { STORAGE_OPTIONS } from '../tokens';
import { StorageFileUploadResponse, StorageFileUploadResult, type StorageOptions } from '../types';

@Injectable()
export class StorageClientImpl implements StorageClient {
  constructor(
    @Inject(STORAGE_OPTIONS)
    private readonly options: StorageOptions,
    private readonly httpService: HttpService,
  ) {}

  async uploadFile(file: Express.Multer.File): Promise<StorageFileUploadResult> {
    return this.uploadBuffer(file.buffer, file.originalname);
  }

  async uploadBuffer(buffer: Buffer, filename?: string): Promise<StorageFileUploadResult> {
    const fileType = await FileDescriptor.fromBuffer(buffer, filename);
    const blob = new Blob([new Uint8Array(buffer)], { type: fileType.mime });
    const formData = new FormData();

    formData.append('file', blob);

    const { data } = await lastValueFrom(
      this.httpService.post<StorageFileUploadResponse>(this.options.url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-texlo-storage-key': this.options.key,
        },
      }),
    );

    return { id: data.id, url: `${this.options.url}/${data.id}`, filename: data.filename, mimetype: data.mimetype };
  }
}
