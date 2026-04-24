import { File } from '@libs/persistence';

import { BucketFile } from '../domain';

export class BucketMapper {
  static toFile(file: File): BucketFile {
    const bucketFile = new BucketFile();

    bucketFile.id = file.metadata.id;
    bucketFile.filename = file.filename;
    bucketFile.mimetype = file.metadata.mimetype;
    bucketFile.uploadDate = file.uploadDate;

    return bucketFile;
  }
}
