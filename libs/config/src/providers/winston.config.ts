import { ConfigService, registerAs } from '@nestjs/config';

import { utilities } from 'nest-winston';
import winston from 'winston';

import { NodeEnv } from '../enums';
import { WINSTON_CONFIG } from '../tokens';

export const winstonConfig = registerAs(WINSTON_CONFIG, () => {
  const configService = new ConfigService();

  const name = configService.get<string>('npm_package_name');
  const version = configService.get<string>('npm_package_version');
  const isLocal = configService.getOrThrow<NodeEnv>('NODE_ENV') === NodeEnv.Local;

  return {
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          isLocal
            ? utilities.format.nestLike(`${name}:${version}`, {
                appName: true,
                processId: true,
                prettyPrint: true,
                colors: true,
              })
            : winston.format.json(),
        ),
      }),
    ],
    level: isLocal ? 'silly' : 'verbose',
  };
});
