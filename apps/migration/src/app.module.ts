import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { typeormConfig } from '@libs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['apps/migration/.env', '.env'],
      load: [typeormConfig],
    }),
  ],
})
export class AppModule {}
