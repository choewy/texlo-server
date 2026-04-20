import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FileSchema } from '@libs/persistence';

import { BucketController } from './bucket.controller';
import { BucketService } from './bucket.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: File.name, schema: FileSchema }])],
  controllers: [BucketController],
  providers: [BucketService],
})
export class BucketModule {}
