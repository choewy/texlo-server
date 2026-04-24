import { VoiceSyncLockStatus } from '../domain';

export interface VoiceSyncLockRepository {
  update(id: string, status: VoiceSyncLockStatus, error?: string): Promise<void>;
}
