import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CONTEXT_SERVICE, type ContextService } from '../common';

import { ProfileResDTO } from './dtos';
import { UserService } from './user.service';

@ApiTags('사용자')
@Controller('users')
export class UserController {
  constructor(
    @Inject(CONTEXT_SERVICE)
    private readonly contextService: ContextService,
    private readonly userService: UserService,
  ) {}

  @Get('me')
  @ApiOperation({ summary: '프로필 조회' })
  @ApiOkResponse({ type: ProfileResDTO })
  getProfile() {
    return this.userService.getProfile(this.contextService.user.id);
  }
}
