import { NestFactory } from '@nestjs/core';

import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, { bufferLogs: true });

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.enableShutdownHooks();

  await app.init();
}

void bootstrap();
