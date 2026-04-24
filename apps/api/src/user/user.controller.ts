import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Serializer } from '@libs/http';

import { CONTEXT_SERVICE, type ContextService } from '../common';

import { OAuthResDTO, ProfileResDTO } from './dtos';
import { UserService } from './user.service';

@ApiTags('사용자')
@Controller('users')
export class UserController {
  constructor(
    @Inject(CONTEXT_SERVICE)
    private readonly contextService: ContextService,
    private readonly userService: UserService,
  ) {}

  @Get('profile')
  @Serializer(ProfileResDTO)
  @ApiOperation({ summary: '프로필 조회' })
  @ApiOkResponse({ type: ProfileResDTO })
  getProfile() {
    return this.userService.getProfile(this.contextService.user);
  }

  @Get('oauth')
  @Serializer(OAuthResDTO)
  @ApiOperation({ summary: 'OAuth 계정 조회' })
  @ApiOkResponse({ type: OAuthResDTO })
  getOAuths() {
    return this.userService.getOAuths(this.contextService.user);
  }
}
