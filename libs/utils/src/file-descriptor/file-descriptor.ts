import { fileTypeFromBuffer, FileTypeOptions } from 'file-type';
import mimeTypes from 'mime-types';

import { FileTypeError } from './errors';

export class FileDescriptor {
  static async fromBuffer(buffer: ArrayBuffer | Uint8Array<ArrayBufferLike>, filename?: string, options?: FileTypeOptions) {
    const fileType = await fileTypeFromBuffer(buffer, options);

    if (fileType) {
      return fileType;
    }

    const ext = filename?.split('.').pop()?.toLowerCase();

    if (!ext) {
      throw new FileTypeError('Cannot determine file type: missing extension');
    }

    const mime = mimeTypes.lookup(ext);

    if (!mime) {
      throw new FileTypeError(`Cannot determine file type: unsupported extension ".${ext}"`);
    }

    return { mime, ext };
  }

  static async fromFile(file: Express.Multer.File, options?: FileTypeOptions) {
    return this.fromBuffer(file.buffer, file.originalname, options);
  }
}
