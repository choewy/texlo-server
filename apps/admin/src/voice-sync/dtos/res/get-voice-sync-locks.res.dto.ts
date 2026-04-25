import { ApiProperty } from '@nestjs/swagger';

import { Expose, Type } from 'class-transformer';

import { VoiceSyncLockResDTO } from './voice-sync-lock.res.dto';

export class GetVoiceSyncLocksResDTO {
  @ApiProperty({ type: Number })
  @Expose()
  total!: number;

  @ApiProperty({ type: VoiceSyncLockResDTO })
  @Type(() => VoiceSyncLockResDTO)
  @Expose()
  rows!: VoiceSyncLockResDTO[];
}
