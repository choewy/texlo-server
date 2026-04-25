import { VoiceProvider } from '@apps/admin/shared';

import { VoiceSyncLock } from '../domain';

export type GetVoiceSyncLocksParams = {
  provider?: VoiceProvider;
  page: number;
  take: number;
};

export interface VoiceSyncLockRepository {
  find(params: GetVoiceSyncLocksParams): Promise<[VoiceSyncLock[], number]>;
  insert(params: Pick<VoiceSyncLock, 'provider' | 'adminId'>): Promise<VoiceSyncLock>;
  hasActivated(provider: VoiceProvider): Promise<boolean>;
  deleteById(id: string): Promise<void>;
}
