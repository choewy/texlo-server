import 'multer';

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { HTTP_CONFIG, HttpConfig } from '@libs/config';

import { AppModule } from './app.module';
import { setupDocument } from './document';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const configService = app.get(ConfigService);

  const { port, hostname, cors } = configService.getOrThrow<HttpConfig>(HTTP_CONFIG);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.enableShutdownHooks();
  app.enableCors(cors);

  setupDocument(app);

  await app.listen(port, hostname);
}

void bootstrap();
