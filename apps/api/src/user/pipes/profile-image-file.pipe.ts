import { HttpStatus, ParseFilePipeBuilder } from '@nestjs/common';

export const ProfileImageFileMaxSize = 10 * 1024 * 1024;
export const ProfileImageFilePipe = new ParseFilePipeBuilder()
  .addFileTypeValidator({ fileType: /^image\/.+/ })
  .addMaxSizeValidator({ maxSize: ProfileImageFileMaxSize })
  .build({ errorHttpStatusCode: HttpStatus.BAD_REQUEST });
