import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { WinstonModule } from 'nest-winston';

import { httpConfig, storageConfig, WINSTON_CONFIG, winstonConfig } from '@libs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['apps/storage/.env', '.env'],
      load: [httpConfig, winstonConfig, storageConfig],
    }),
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return configService.getOrThrow(WINSTON_CONFIG);
      },
    }),
  ],
})
export class StorageModule {}
