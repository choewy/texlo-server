import { Body, Controller, Delete, HttpCode, HttpStatus, Inject, Post, Req, Res, UseInterceptors } from '@nestjs/common';
import { ApiCreatedResponse, ApiNoContentResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { type Request, type Response } from 'express';

import { COOKIE_SERVICE, type CookieService } from '@libs/http';

import { CookieKey, Public } from '../common';

import { AuthService } from './auth.service';
import { IssueTokenReqDTO } from './dtos';
import { ClearCookiesOnInvalidTokenInterceptor } from './interceptors';

@Public()
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
  async issue(@Body() body: IssueTokenReqDTO, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.issue(body);

    this.cookieService.setCacheControl(res);
    this.cookieService.set(res, CookieKey.AccessToken, tokens.accessToken, 20);
    this.cookieService.set(res, CookieKey.RefreshToken, tokens.refreshToken, 20);
  }

  @Post('refresh')
  @ApiOperation({ summary: '토큰 갱신' })
  @ApiCreatedResponse()
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.refresh({
      accessToken: this.cookieService.parse(req, CookieKey.AccessToken),
      refreshToken: this.cookieService.parse(req, CookieKey.RefreshToken),
    });

    this.cookieService.setCacheControl(res);
    this.cookieService.set(res, CookieKey.AccessToken, tokens.accessToken, 20);
    this.cookieService.set(res, CookieKey.RefreshToken, tokens.refreshToken, 20);
  }

  @Delete('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '로그아웃' })
  @ApiNoContentResponse()
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout({
      accessToken: this.cookieService.parse(req, CookieKey.AccessToken),
      refreshToken: this.cookieService.parse(req, CookieKey.RefreshToken),
    });

    this.cookieService.clear(res, CookieKey.AccessToken);
    this.cookieService.clear(res, CookieKey.RefreshToken);
  }
}
