import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { OAuthProvider } from '@apps/api/shared';

export class OAuthResDTO {
  @ApiProperty({ type: String, format: 'uuid' })
  @Expose()
  id!: string;

  @ApiProperty({ enum: OAuthProvider })
  @Expose()
  provider!: OAuthProvider;

  @ApiProperty({ type: Date })
  @Expose()
  createdAt!: Date;

  @ApiProperty({ type: Date })
  @Expose()
  updatedAt!: Date;
}
