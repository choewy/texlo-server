import { VoiceAge, VoiceGender, VoiceLanguage, VoiceProvider } from '@apps/api/shared';

import { Voice } from '../domain';

export type FindVoiceParams = {
  provider?: VoiceProvider;
  age?: VoiceAge;
  gender?: VoiceGender;
  language?: VoiceLanguage;
  favorite?: 'true' | 'false';
  page: number;
  take: number;
  userId?: string;
};

export interface VoiceRepository {
  findOneById(id: string): Promise<Voice | null>;
  find(params: FindVoiceParams): Promise<[Voice[], number]>;
}
