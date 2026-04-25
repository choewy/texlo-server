import { AdminEntity, VoiceSyncLockEntity } from '@libs/persistence';

import { VoiceSyncLock, VoiceSyncLockAdmin } from '../domain';

export class VoiceSyncLockMapper {
  static toVoiceSyncLock(entity: VoiceSyncLockEntity): VoiceSyncLock {
    const voiceSyncLock = new VoiceSyncLock();

    voiceSyncLock.id = entity.id;
    voiceSyncLock.provider = entity.provider;
    voiceSyncLock.status = entity.status;
    voiceSyncLock.adminId = entity.adminId;
    voiceSyncLock.admin = entity.admin ? this.toVoiceSyncLockAdmin(entity.admin) : null;
    voiceSyncLock.createdAt = entity.createdAt;
    voiceSyncLock.updatedAt = entity.updatedAt;

    return voiceSyncLock;
  }

  static toVoiceSyncLockAdmin(entity: AdminEntity): VoiceSyncLockAdmin {
    const admin = new VoiceSyncLockAdmin();

    admin.id = entity.id;
    admin.email = entity.email;
    admin.name = entity.name;

    return admin;
  }
}
