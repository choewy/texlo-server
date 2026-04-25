import { VoiceAge, VoiceGender, VoiceLanguage, VoiceProvider } from '@apps/admin/shared';

import { Voice } from '../domain';

export type GetVoiceParams = {
  provider?: VoiceProvider;
  age?: VoiceAge;
  gender?: VoiceGender;
  language?: VoiceLanguage;
  favorite?: 'true' | 'false';
  page: number;
  take: number;
};

export interface VoiceRepository {
  find(params: GetVoiceParams): Promise<[Voice[], number]>;
}
