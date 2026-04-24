import { OAuthProvider } from '@apps/api/shared';

export class OAuth {
  id!: string;
  provider!: OAuthProvider;
  providerId!: string;
  profile!: object;
  userId!: string;
}
