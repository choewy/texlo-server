import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { WinstonModule } from 'nest-winston';

import { httpConfig, MONGOOSE_CONFIG, MongooseConfig, mongooseConfig, storageConfig, WINSTON_CONFIG, WinstonConfig, winstonConfig } from '@libs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['apps/storage/.env', '.env'],
      load: [httpConfig, winstonConfig, mongooseConfig, storageConfig],
    }),
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return configService.getOrThrow<WinstonConfig>(WINSTON_CONFIG);
      },
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return configService.getOrThrow<MongooseConfig>(MONGOOSE_CONFIG);
      },
    }),
  ],
})
export class StorageModule {}
