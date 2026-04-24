import { Module } from '@nestjs/common';

import { OAUTH_REPOSITORY, TypeOrmOAuthRepository, TypeOrmUserRepository, USER_REPOSITORY } from './repositories';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: USER_REPOSITORY,
      useClass: TypeOrmUserRepository,
    },
    {
      provide: OAUTH_REPOSITORY,
      useClass: TypeOrmOAuthRepository,
    },
  ],
})
export class UserModule {}
