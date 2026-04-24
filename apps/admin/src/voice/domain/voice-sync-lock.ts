import { VoiceProvider, VoiceSyncLockStatus } from '@apps/admin/shared';

export class VoiceSyncLock {
  id!: string;
  admin!: string | null;
  provider!: VoiceProvider;
  status!: VoiceSyncLockStatus;
  adminId!: string | null;
  createdAt!: Date;
  updatedAt!: Date;
}
