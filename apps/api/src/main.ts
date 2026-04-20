import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import cookieParser from 'cookie-parser';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { HTTP_CONFIG, HttpConfig } from '@libs/config';
import { setupDocument } from '@libs/http';

import { ApiModule } from './api.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule, { bufferLogs: true });
  const configService = app.get(ConfigService);

  const { port, hostname, cors } = configService.getOrThrow<HttpConfig>(HTTP_CONFIG);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.setGlobalPrefix('api');
  app.enableVersioning({ defaultVersion: '1', type: VersioningType.URI });
  app.enableCors(cors);
  app.use(cookieParser());

  setupDocument(app);

  await app.listen(port, hostname);
}

void bootstrap();
