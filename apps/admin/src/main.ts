import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';

import cookieParser from 'cookie-parser';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { HTTP_CONFIG, HttpConfig, REDIS_CONFIG, RedisConfig } from '@libs/config';

import { AdminModule } from './admin.module';
import { setupDocument } from './document';

async function bootstrap() {
  const app = await NestFactory.create(AdminModule, { bufferLogs: true });
  const configService = app.get(ConfigService);
  const redisConfig = configService.get<RedisConfig>(REDIS_CONFIG);

  const { port, hostname, cors } = configService.getOrThrow<HttpConfig>(HTTP_CONFIG);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.enableVersioning({ defaultVersion: '1', type: VersioningType.URI });
  app.enableCors(cors);
  app.enableShutdownHooks();
  app.connectMicroservice({
    transport: Transport.REDIS,
    options: redisConfig,
  });

  setupDocument(app);

  await app.listen(port, hostname);
}

void bootstrap();
