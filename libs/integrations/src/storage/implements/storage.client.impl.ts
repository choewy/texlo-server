import { Inject, Injectable } from '@nestjs/common';

import { createReadStream } from 'node:fs';
import { basename } from 'node:path';
import { Readable } from 'node:stream';
import axios, { AxiosHeaders, AxiosInstance } from 'axios';
import mimeTypes from 'mime-types';

import { FileDescriptor } from '@libs/utils';

import { StorageClient } from '../contracts';
import { STORAGE_OPTIONS } from '../tokens';
import { StorageFileUploadResponse, StorageFileUploadResult, StorageFileUploadStreamOptions, type StorageOptions } from '../types';

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

  private getUrl(path: string): string {
    return `${this.options.url}/${path}`;
  }

  private toUploadResult(data: StorageFileUploadResponse): StorageFileUploadResult {
    return {
      id: data.id,
      url: this.getUrl(data.id),
      filename: data.filename,
      mimetype: data.mimetype,
      size: data.size,
    };
  }

  private normalizeHeader(value: unknown): string | undefined {
    if (Array.isArray(value)) {
      return this.normalizeHeader(value[0]);
    }

    if (value == null) {
      return undefined;
    }

    if (typeof value === 'string') {
      return value;
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }

    return undefined;
  }

  private getFilenameFromUrl(url: string): string | undefined {
    try {
      const filename = basename(new URL(url).pathname);
      return filename || undefined;
    } catch {
      return undefined;
    }
  }

  is(url: string): boolean {
    return url.startsWith(this.options.url);
  }

  async uploadFile(file: Express.Multer.File | string): Promise<StorageFileUploadResult> {
    if (typeof file === 'string') {
      return this.uploadFilePath(file);
    }

    return this.uploadBuffer(file.buffer, file.originalname);
  }

  async uploadFilePath(path: string): Promise<StorageFileUploadResult> {
    return this.uploadStream(createReadStream(path), {
      filename: basename(path),
      mimetype: mimeTypes.lookup(path) || undefined,
    });
  }

  async uploadUrl(url: string, filename?: string): Promise<StorageFileUploadResult> {
    const { data, headers } = await axios.get<Readable>(url, { responseType: 'stream' });

    return this.uploadStream(data, {
      filename: filename ?? this.getFilenameFromUrl(url),
      mimetype: this.normalizeHeader(headers['content-type']),
    });
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

    return this.toUploadResult(data);
  }

  async uploadStream(stream: Readable, options: StorageFileUploadStreamOptions = {}): Promise<StorageFileUploadResult> {
    const headers = new AxiosHeaders().set('Content-Type', options.mimetype ?? 'application/octet-stream');

    if (options?.filename) {
      headers.set('x-filename', options.filename);
    }

    const { data } = await this.api.post<StorageFileUploadResponse>(this.getUrl('stream'), stream, {
      headers,
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });

    return this.toUploadResult(data);
  }

  async remove(url: string): Promise<void> {
    const id = this.parseId(url);

    if (id) {
      await this.api.delete<void>(`${this.options.url}/${id}`);
    }
  }
}
