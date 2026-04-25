import { VoiceProvider } from '@apps/admin/shared';

export interface GetVoiceSyncLocksInput {
  provider?: VoiceProvider;
  page: number;
  take: number;
}
