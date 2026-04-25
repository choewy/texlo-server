import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

export class VoiceSyncLockAdminResDTO {
  @ApiProperty({ type: String, format: 'uuid' })
  @Expose()
  id!: string;

  @ApiProperty({ type: String })
  @Expose()
  email!: string;

  @ApiProperty({ type: String })
  @Expose()
  name!: string;
}
