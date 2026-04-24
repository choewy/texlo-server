import { Inject, Injectable } from '@nestjs/common';

import axios, { AxiosInstance } from 'axios';

import { FileDescriptor } from '@libs/utils';

import { StorageClient } from '../contracts';
import { STORAGE_OPTIONS } from '../tokens';
import { StorageFileUploadResponse, StorageFileUploadResult, type StorageOptions } from '../types';

@Injectable()
export class StorageClientImpl implements StorageClient {
  private readonly api: AxiosInstance;

  constructor(
    @Inject(STORAGE_OPTIONS)
    private readonly options: StorageOptions,
  ) {
    this.api = axios.create({
      baseURL: this.options.url,
      headers: {
        'x-texlo-storage-key': this.options.key,
      },
    });
  }

  private parseId(url: string): string {
    const id = url.replace(this.options.url, '').trim();

    if (id.startsWith('/')) {
      return id.slice(1);
    } else {
      return id;
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<StorageFileUploadResult> {
    return this.uploadBuffer(file.buffer, file.originalname);
  }

  async uploadBuffer(buffer: Buffer, filename?: string): Promise<StorageFileUploadResult> {
    const fileType = await FileDescriptor.fromBuffer(buffer, filename);
    const blob = new Blob([new Uint8Array(buffer)], { type: fileType.mime });
    const formData = new FormData();

    formData.append('file', blob);

    const { data } = await this.api.post<StorageFileUploadResponse>(this.options.url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-texlo-storage-key': this.options.key,
      },
    });

    return { id: data.id, url: `${this.options.url}/${data.id}`, filename: data.filename, mimetype: data.mimetype };
  }

  async remove(url: string): Promise<void> {
    const id = this.parseId(url);

    if (id) {
      await this.api.delete<void>(`${this.options.url}/${id}`);
    }
  }
}
