import { VoiceProvider, VoiceSyncLockStatus } from '@apps/admin/shared';

import { VoiceSyncLockAdmin } from './voice-sync-lock-admin';

export class VoiceSyncLock {
  id!: string;
  provider!: VoiceProvider;
  status!: VoiceSyncLockStatus;
  adminId!: string | null;
  admin!: VoiceSyncLockAdmin | null;
  createdAt!: Date;
  updatedAt!: Date;
}
