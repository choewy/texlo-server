import { ApiProperty } from '@nestjs/swagger';

import { Expose, Type } from 'class-transformer';

import { OAuthProvider } from '@apps/api/shared';

export class ProfileOAuthResDTO {
  @ApiProperty({ type: String, format: 'uuid' })
  @Expose()
  id!: string;

  @ApiProperty({ enum: OAuthProvider })
  @Expose()
  provider!: OAuthProvider;
}

export class ProfileResDTO {
  @ApiProperty({ type: String, format: 'uuid' })
  @Expose()
  id!: string;

  @ApiProperty({ type: String })
  @Expose()
  nickname!: string;

  @ApiProperty({ type: String })
  @Expose()
  profileImageUrl!: string | null;

  @ApiProperty({ type: ProfileOAuthResDTO })
  @Type(() => ProfileOAuthResDTO)
  @Expose()
  oauth!: ProfileOAuthResDTO;
}
