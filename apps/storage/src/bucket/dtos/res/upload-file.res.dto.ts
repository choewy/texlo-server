import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

export class UploadFileResDTO {
  @ApiProperty({ type: String })
  @Expose()
  readonly id!: string;

  @ApiProperty({ type: String })
  @Expose()
  readonly filename!: string;

  @ApiProperty({ type: String })
  @Expose()
  readonly mimetype!: string;

  @ApiProperty({ type: String })
  @Expose()
  readonly size!: string;

  @ApiProperty({ type: Date })
  @Expose()
  readonly uploadDate!: Date;
}
