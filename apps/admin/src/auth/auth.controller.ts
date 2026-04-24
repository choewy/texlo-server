import { Body, Controller, Delete, HttpCode, HttpStatus, Inject, Post, Req, Res, UseInterceptors, UsePipes } from '@nestjs/common';
import { ApiCreatedResponse, ApiNoContentResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { type Request, type Response } from 'express';

import { COOKIE_SERVICE, type CookieService, FieldMatchPipe } from '@libs/http';

import { CookieKey, Public } from '../common';

import { AuthService } from './auth.service';
import { LoginReqDTO, RegisterReqDTO } from './dtos';
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

  @Post('login')
  @ApiOperation({ summary: '로그인' })
  @ApiCreatedResponse()
  async login(@Body() body: LoginReqDTO, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(body);

    this.cookieService.setCacheControl(res);
    this.cookieService.set(res, CookieKey.AccessToken, accessToken, 20);
    this.cookieService.set(res, CookieKey.RefreshToken, refreshToken, 20);
  }

  @Post('register')
  @UsePipes(new FieldMatchPipe<RegisterReqDTO>('password', 'confirmPassword'))
  @ApiOperation({ summary: '회원가입' })
  @ApiCreatedResponse()
  async register(@Body() body: RegisterReqDTO, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.authService.register(body);

    this.cookieService.setCacheControl(res);
    this.cookieService.set(res, CookieKey.AccessToken, accessToken, 20);
    this.cookieService.set(res, CookieKey.RefreshToken, refreshToken, 20);
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

    this.cookieService.setCacheControl(res);
    this.cookieService.clear(res, CookieKey.AccessToken);
    this.cookieService.clear(res, CookieKey.RefreshToken);
  }
}
