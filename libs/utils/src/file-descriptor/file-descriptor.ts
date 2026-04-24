import { fileTypeFromBuffer, FileTypeOptions } from 'file-type';
import mimeTypes from 'mime-types';
import sharp from 'sharp';

import { FileTypeError } from './errors';

const ResizedImageMaxSize = 5 * 1024 * 1024;
const ResizedImageWidth = 400;
const ResizedImageHeight = 400;
const ResizedImageInitialQuality = 90;
const ResizedImageMinQuality = 10;
const ResizedImageQualityStep = 10;

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

  static async resizeImageFile(file: Express.Multer.File): Promise<Express.Multer.File> {
    try {
      const toWebpBuffer = (quality: number) =>
        sharp(file.buffer)
          .rotate()
          .resize(ResizedImageWidth, ResizedImageHeight, {
            fit: 'cover',
            position: 'centre',
          })
          .webp({ quality })
          .toBuffer();

      let quality = ResizedImageInitialQuality;
      let resizedBuffer = await toWebpBuffer(quality);

      while (resizedBuffer.byteLength > ResizedImageMaxSize && quality > ResizedImageMinQuality) {
        quality -= ResizedImageQualityStep;
        resizedBuffer = await toWebpBuffer(quality);
      }

      if (resizedBuffer.byteLength > ResizedImageMaxSize) {
        throw new FileTypeError('Cannot compress image: exceeds 5MB after resize');
      }

      file.buffer = resizedBuffer;
      file.size = resizedBuffer.byteLength;
      file.mimetype = 'image/webp';
      file.originalname = `${file.originalname.replace(/\.[^/.]+$/, '') || 'image'}.webp`;

      return file;
    } catch (e) {
      if (e instanceof FileTypeError) {
        throw e;
      }

      throw new FileTypeError('Cannot process image: unsupported or corrupted image file');
    }
  }
}
