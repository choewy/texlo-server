import { Controller, Delete, HttpCode, HttpStatus, Inject, Post, UseInterceptors } from '@nestjs/common';
import { ApiCreatedResponse, ApiNoContentResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { COOKIE_SERVICE, type CookieService } from '@libs/http';

import { AuthService } from './auth.service';
import { ClearCookiesOnInvalidTokenInterceptor } from './interceptors';

@ApiTags('인증')
@Controller('auth')
@UseInterceptors(ClearCookiesOnInvalidTokenInterceptor)
export class AuthController {
  constructor(
    @Inject(COOKIE_SERVICE)
    private readonly cookieService: CookieService,
    private readonly authService: AuthService,
  ) {}

  @Post('issue')
  @ApiOperation({ summary: '토큰 발급' })
  @ApiCreatedResponse()
  async issue() {
    await Promise.resolve();
    return;
  }

  @Post('refresh')
  @ApiOperation({ summary: '토큰 갱신' })
  @ApiCreatedResponse()
  async refresh() {
    await Promise.resolve();
    return;
  }

  @Delete('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '로그아웃' })
  @ApiNoContentResponse()
  async logout() {
    await Promise.resolve();
    return;
  }
}
