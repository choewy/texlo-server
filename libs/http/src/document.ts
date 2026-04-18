import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupDocument(app: INestApplication) {
  SwaggerModule.setup(
    'docs',
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle(process.env.npm_package_name ?? '')
        .setVersion(process.env.npm_package_version ?? '')
        .addBearerAuth({ type: 'http', in: 'header' }, 'authorization')
        .addSecurityRequirements('authorization')
        .build(),
    ),
  );
}
