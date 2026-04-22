import { OAuthProvider } from './enums';

export class OAuth {
  id!: string;
  provider!: OAuthProvider;
  providerId!: string;
  profile!: object;
  userId!: string;
}
