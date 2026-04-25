import { VoiceSyncLock } from '../../domain';

export interface GetVoiceSyncLocksResult {
  total: number;
  rows: VoiceSyncLock[];
}
