import { ApiProperty } from '@nestjs/swagger';

import { Expose, Type } from 'class-transformer';

import { VoiceProvider, VoiceSyncLockStatus } from '@apps/admin/shared';

import { VoiceSyncLockAdminResDTO } from './voice-sync-lock-admin.res.dto';

export class VoiceSyncLockResDTO {
  @ApiProperty({ type: String, format: 'uuid' })
  @Expose()
  id!: string;

  @ApiProperty({ enum: VoiceProvider })
  @Expose()
  provider!: VoiceProvider;

  @ApiProperty({ enum: VoiceSyncLockStatus })
  @Expose()
  status!: VoiceSyncLockStatus;

  @ApiProperty({ type: Object })
  @Expose()
  error!: object | null;

  @ApiProperty({ type: Date })
  @Expose()
  createdAt!: Date;

  @ApiProperty({ type: Date })
  @Expose()
  updatedAt!: Date;

  @ApiProperty({ type: VoiceSyncLockAdminResDTO })
  @Type(() => VoiceSyncLockAdminResDTO)
  @Expose()
  admin!: VoiceSyncLockAdminResDTO | null;
}
