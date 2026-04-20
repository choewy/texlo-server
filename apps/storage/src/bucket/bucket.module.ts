import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { STORAGE_CONFIG, StorageConfig } from '@libs/config';
import { File, FileSchema } from '@libs/persistence';

import { BucketController } from './bucket.controller';
import { BucketService } from './bucket.service';
import { BucketGuard } from './guards';

@Module({
  imports: [MongooseModule.forFeature([{ name: File.name, schema: FileSchema }])],
  controllers: [BucketController],
  providers: [
    {
      inject: [ConfigService],
      provide: STORAGE_CONFIG,
      useFactory(configService: ConfigService) {
        return configService.getOrThrow<StorageConfig>(STORAGE_CONFIG);
      },
    },
    BucketService,
    BucketGuard,
  ],
})
export class BucketModule {}
