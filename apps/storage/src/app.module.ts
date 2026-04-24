import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';

import { WinstonModule } from 'nest-winston';

import { httpConfig, MONGOOSE_CONFIG, MongooseConfig, mongooseConfig, storageConfig, WINSTON_CONFIG, WinstonConfig, winstonConfig } from '@libs/config';
import { GlobalHttpExceptionFilter, GlobalValidationPipe } from '@libs/http';

import { BucketModule } from './bucket';

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
    BucketModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: GlobalValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalHttpExceptionFilter,
    },
  ],
})
export class AppModule {}
