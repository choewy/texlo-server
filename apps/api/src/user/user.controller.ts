import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Patch, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Serializer } from '@libs/http';

import { CONTEXT_SERVICE, type ContextService } from '../common';

import { OAuthResDTO, ProfileResDTO, UpdateProfileImageReqDTO, UpdateProfileReqDTO } from './dtos';
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

  @Patch('profile')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '프로필 수정' })
  @ApiNoContentResponse()
  updateProfile(@Body() body: UpdateProfileReqDTO) {
    return this.userService.updateProfile(this.contextService.user.id, body);
  }

  @Put('profile/image')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '프로필 이미지 변경' })
  @ApiBody({ type: UpdateProfileImageReqDTO })
  @ApiNoContentResponse()
  updateProfileImage(@UploadedFile() file: Express.Multer.File) {
    return this.userService.updateProfileImage(this.contextService.user.id, file);
  }
}
