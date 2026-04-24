import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupDocument(app: INestApplication) {
  SwaggerModule.setup(
    'docs',
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('Texlo Admin API')
        .setVersion('v0.0.1')
        .addBearerAuth({ type: 'http', in: 'header' }, 'authorization')
        .addSecurityRequirements('authorization')
        .build(),
    ),
  );
}
