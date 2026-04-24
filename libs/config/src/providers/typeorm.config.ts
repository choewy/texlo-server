import { ConfigService, ConfigType, registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { resolve } from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { DIST_APP_ROOT } from '../constants';
import { NodeEnv } from '../enums';
import { TYPEORM_CONFIG } from '../tokens';

export const typeormConfig = registerAs(TYPEORM_CONFIG, (): TypeOrmModuleOptions => {
  const configService = new ConfigService();
  const isLocal = configService.getOrThrow<NodeEnv>('NODE_ENV') === NodeEnv.Local;

  return {
    type: 'postgres',
    host: configService.getOrThrow<string>('DB_HOST'),
    port: +configService.getOrThrow<string>('DB_PORT'),
    username: configService.getOrThrow<string>('DB_USERNAME'),
    password: configService.getOrThrow<string>('DB_PASSWORD'),
    database: configService.getOrThrow<string>('DB_DATABASE'),
    namingStrategy: new SnakeNamingStrategy(),
    logging: isLocal ? true : ['error', 'warn'],
    entities: [resolve(DIST_APP_ROOT, 'libs/**/*.entity.{js,ts}')],
    migrations: [resolve(DIST_APP_ROOT, 'apps/**/*-migration.{js,ts}')],
    synchronize: false,
  };
});

export type TypeOrmConfig = ConfigType<typeof typeormConfig>;
