import { VoiceAge, VoiceGender, VoiceLanguage } from '@apps/api/shared';

export interface GetVoicesInput {
  age?: VoiceAge;
  gender?: VoiceGender;
  language?: VoiceLanguage;
  like?: 'true' | 'false';
  page: number;
  take: number;
}
