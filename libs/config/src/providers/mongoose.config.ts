import { ConfigService, ConfigType, registerAs } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

import { MONGOOSE_CONFIG } from '../tokens';

export const mongooseConfig = registerAs(MONGOOSE_CONFIG, (): MongooseModuleOptions => {
  const configService = new ConfigService();

  return {
    uri: configService.getOrThrow<string>('MONGO_URI'),
    user: configService.getOrThrow<string>('MONGO_USERNAME'),
    pass: configService.getOrThrow<string>('MONGO_PASSWORD'),
    dbName: configService.getOrThrow<string>('MONGO_DB_NAME'),
  };
});

export type MongooseConfig = ConfigType<typeof mongooseConfig>;
