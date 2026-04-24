import { VoiceSyncLockEntity } from '@libs/persistence';

import { VoiceSyncLock } from '../domain';

export class VoiceSyncLockMapper {
  static toVoiceSyncLock(entity: VoiceSyncLockEntity): VoiceSyncLock {
    const voiceSyncLock = new VoiceSyncLock();

    voiceSyncLock.id = entity.id;
    voiceSyncLock.provider = entity.provider;
    voiceSyncLock.status = entity.status;
    voiceSyncLock.adminId = entity.adminId;
    voiceSyncLock.createdAt = entity.createdAt;
    voiceSyncLock.updatedAt = entity.updatedAt;

    return voiceSyncLock;
  }
}
