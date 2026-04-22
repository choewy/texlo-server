import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { File, FileSchema } from '@libs/persistence';

import { BucketController } from './bucket.controller';
import { BucketService } from './bucket.service';
import { BucketGuard } from './guards';

@Module({
  imports: [MongooseModule.forFeature([{ name: File.name, schema: FileSchema }])],
  controllers: [BucketController],
  providers: [BucketService, BucketGuard],
})
export class BucketModule {}
