import { OAuthEntity, UserEntity } from '@libs/persistence';

import { OAuth, User } from '../domain';

export class UserMapper {
  static toUser(entity: UserEntity): User {
    const user = new User();

    user.id = entity.id;
    user.nickname = entity.nickname;
    user.profileImageUrl = entity.profileImageUrl;

    return user;
  }

  static toOAuth(entity: OAuthEntity): OAuth {
    const oauth = new OAuth();

    oauth.id = entity.id;
    oauth.provider = entity.provider;
    oauth.createdAt = entity.createdAt;
    oauth.updatedAt = entity.updatedAt;

    return oauth;
  }
}
