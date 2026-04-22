import { OAuthEntity, UserEntity } from '@libs/persistence';

import { OAuth, User } from '../domain';

export class OAuthMapper {
  static toUser(entity: UserEntity) {
    const user = new User();

    user.id = entity.id;

    return user;
  }

  static toOAuth(entity: OAuthEntity) {
    const oauth = new OAuth();

    oauth.id = entity.id;
    oauth.provider = entity.provider;
    oauth.providerId = entity.providerId;
    oauth.profile = entity.profile;
    oauth.userId = entity.userId;

    return oauth;
  }
}
