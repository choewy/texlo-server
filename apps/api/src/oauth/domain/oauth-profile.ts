import { OAuthProvider } from '@libs/persistence';

export class OAuthProfile {
  provider!: OAuthProvider;
  providerId!: string;
  email!: string | null;
  name!: string | null;
  profileImageUrl!: string | null;
}
