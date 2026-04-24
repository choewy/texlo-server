import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';

export function setupDocument(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Texlo Storage API')
    .setVersion('v0.0.1')
    .addSecurity('x-texlo-storage-key', {
      name: 'x-texlo-storage-key',
      type: 'apiKey',
      in: 'header',
    })
    .addSecurityRequirements('x-texlo-storage-key')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const options: SwaggerCustomOptions = {
    explorer: true,
    swaggerOptions: {
      authAction: {
        'x-texlo-storage-key': {
          value: process.env.STORAGE_KEY,
          schema: {
            type: 'apiKey',
            in: 'header',
          },
        },
      },
    },
  };

  SwaggerModule.setup('docs', app, document, options);
}
