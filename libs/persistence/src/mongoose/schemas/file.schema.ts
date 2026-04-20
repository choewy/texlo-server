import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument, Types } from 'mongoose';

export type FileDocument = HydratedDocument<File>;

@Schema({ collection: 'fs.files' })
export class File {
  @Prop({ type: Types.ObjectId, required: true })
  _id: Types.ObjectId;

  @Prop({ type: Number, required: true })
  length: number;

  @Prop({ type: Number, required: true })
  chunkSize: number;

  @Prop({ type: Object, required: true })
  metadata: { id: string; mimetype: string };

  @Prop({ type: Date, required: true })
  uploadDate: Date;

  @Prop({ type: String, required: true })
  filename: string;

  @Prop({ type: String, required: true })
  ext: string;
}

export const FileSchema = SchemaFactory.createForClass(File);
