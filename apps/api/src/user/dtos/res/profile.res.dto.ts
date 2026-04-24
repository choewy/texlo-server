import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

export class ProfileResDTO {
  @ApiProperty({ type: String })
  @Expose()
  nickname!: string;

  @ApiProperty({ type: String })
  @Expose()
  profileImageUrl!: string | null;
}
