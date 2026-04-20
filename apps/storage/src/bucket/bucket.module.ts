import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FileEntity, FileSchema } from '@libs/persistence';

import { BucketController } from './bucket.controller';
import { BucketService } from './bucket.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: FileEntity.name, schema: FileSchema }])],
  controllers: [BucketController],
  providers: [BucketService],
})
export class BucketModule {}
