import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginReqDTO {
  @ApiProperty({ type: String, format: 'email' })
  @IsEmail()
  @IsNotEmpty()
  readonly email!: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  readonly password!: string;
}
