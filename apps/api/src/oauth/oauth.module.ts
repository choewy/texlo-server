import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { GOOGLE_OAUTH_CONFIG, GoogleOAuthConfig } from '@libs/config';
import { TypeOrmTransaction } from '@libs/persistence';

import { AUTH_STORE, RedisAuthStore } from '../shared';

import { GoogleOAuthClient, OAUTH_CLIENTS, OAuthClient } from './clients';
import { OAuthController } from './oauth.controller';
import { OAuthService } from './oauth.service';
import { OAUTH_REPOSITORY, OAUTH_UNIT_OF_WORK, type OAuthTxRepositories, TypeOrmOAuthRepository, TypeOrmUserRepository, USER_REPOSITORY } from './repositories';

@Module({
  controllers: [OAuthController],
  providers: [
    OAuthService,
    GoogleOAuthClient,
    {
      inject: [ConfigService],
      provide: GOOGLE_OAUTH_CONFIG,
      useFactory(configService: ConfigService) {
        return configService.getOrThrow<GoogleOAuthConfig>(GOOGLE_OAUTH_CONFIG);
      },
    },
    {
      provide: OAUTH_CLIENTS,
      inject: [GoogleOAuthClient],
      useFactory(...clients: OAuthClient[]) {
        return clients;
      },
    },
    {
      provide: AUTH_STORE,
      useClass: RedisAuthStore,
    },
    {
      provide: USER_REPOSITORY,
      useClass: TypeOrmUserRepository,
    },
    {
      provide: OAUTH_REPOSITORY,
      useClass: TypeOrmOAuthRepository,
    },
    TypeOrmTransaction.toProvider<OAuthTxRepositories>(OAUTH_UNIT_OF_WORK, ({ dataSource, entityManager }) => {
      return {
        oauthRepository: new TypeOrmOAuthRepository(dataSource, entityManager),
        userRepository: new TypeOrmUserRepository(dataSource, entityManager),
      };
    }),
  ],
})
export class OAuthModule {}
