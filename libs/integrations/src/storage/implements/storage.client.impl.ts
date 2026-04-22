import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';

import { lastValueFrom } from 'rxjs';

import { FileDescriptor } from '@libs/utils';

import { StorageClient } from '../contracts';
import { STORAGE_OPTIONS } from '../tokens';
import { type StorageOptions } from '../types';
import { type FileUploadRes, StorageFileUploadResult } from '../usecases';

@Injectable()
export class StorageClientImpl implements StorageClient {
  constructor(
    @Inject(STORAGE_OPTIONS)
    private readonly options: StorageOptions,
    private readonly httpService: HttpService,
  ) {}

  async uploadFile(file: Express.Multer.File): Promise<StorageFileUploadResult> {
    const fileType = await FileDescriptor.fromFile(file);
    const blob = new Blob([new Uint8Array(file.buffer)], { type: fileType.mime });
    const formData = new FormData();

    formData.append('file', blob, file.originalname);

    const { data } = await lastValueFrom(
      this.httpService.post<FileUploadRes>(this.options.url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-texlo-storage-key': this.options.key,
        },
      }),
    );

    return { id: data.id, url: `${this.options.url}/${data.id}` };
  }

  async uploadBuffer(buffer: Buffer, filename?: string): Promise<StorageFileUploadResult> {
    const fileType = await FileDescriptor.fromBuffer(buffer, filename);
    const blob = new Blob([new Uint8Array(buffer)], { type: fileType.mime });
    const formData = new FormData();

    formData.append('file', blob);

    const { data } = await lastValueFrom(
      this.httpService.post<FileUploadRes>(this.options.url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-texlo-storage-key': this.options.key,
        },
      }),
    );

    return { id: data.id, url: `${this.options.url}/${data.id}` };
  }
}
