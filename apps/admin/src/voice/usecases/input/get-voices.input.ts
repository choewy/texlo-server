import { VoiceAge, VoiceGender, VoiceLanguage, VoiceProvider } from '@apps/admin/shared';

export interface GetVoicesInput {
  provider?: VoiceProvider;
  age?: VoiceAge;
  gender?: VoiceGender;
  language?: VoiceLanguage;
  like?: 'true' | 'false';
  page: number;
  take: number;
}
