import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

export const ProfileImageFileInterceptor = (fieldName: string, maxSize?: number) =>
  UseInterceptors(
    FileInterceptor(fieldName, {
      limits: { fileSize: maxSize },
    }),
  );
