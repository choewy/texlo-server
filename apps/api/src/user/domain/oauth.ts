import { OAuthProvider } from '@apps/api/shared';

export class OAuth {
  id!: string;
  provider!: OAuthProvider;
  createdAt!: Date;
  updatedAt!: Date;
}
