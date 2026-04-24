import '@libs/persistence/typeorm';

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { DataSource, DataSourceOptions } from 'typeorm';

import { TYPEORM_CONFIG } from '@libs/config';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const configService = app.get(ConfigService);

  return new DataSource(configService.getOrThrow<DataSourceOptions>(TYPEORM_CONFIG));
}

export default bootstrap();
