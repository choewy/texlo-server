import { VoiceProvider } from '@apps/admin/shared';

import { VoiceSyncLock } from '../domain';

export interface VoiceSyncLockRepository {
  insert(params: Pick<VoiceSyncLock, 'provider' | 'adminId'>): Promise<VoiceSyncLock>;
  hasActivated(provider: VoiceProvider): Promise<boolean>;
  deleteById(id: string): Promise<void>;
}
