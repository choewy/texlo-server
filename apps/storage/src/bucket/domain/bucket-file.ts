import { File } from '@libs/persistence';

export class BucketFile {
  id: string;
  filename: string;
  mimetype: string;
  uploadDate: Date;

  constructor(file: File) {
    this.id = file.metadata.id;
    this.filename = file.filename;
    this.mimetype = file.metadata.mimetype;
    this.uploadDate = file.uploadDate;
  }
}
