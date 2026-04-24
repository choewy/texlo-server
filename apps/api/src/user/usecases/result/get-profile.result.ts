import { OAuthProvider } from '@apps/api/shared';

export interface GetProfileResult {
  id: string;
  nickname: string;
  profileImageUrl: string | null;
  oauth: {
    id: string;
    provider: OAuthProvider;
  };
}
