import { Controller, Get, HttpStatus, Param, ParseEnumPipe, Query, Res } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiFoundResponse, ApiOperation, ApiPermanentRedirectResponse, ApiTags } from '@nestjs/swagger';

import { type Response } from 'express';

import { OAuthProvider } from './domain';
import { OAuthLoginReqDTO, OAuthProcessReqDTO, OAuthProcessResDTO } from './dtos';
import { OAuthService } from './oauth.service';

@ApiTags('OAuth2.0')
@Controller('oauth')
export class OAuthController {
  constructor(private readonly oauthService: OAuthService) {}

  @Get(':provider/login')
  @ApiOperation({ summary: 'OAuth2.0 로그인' })
  @ApiFoundResponse()
  @ApiPermanentRedirectResponse({ type: OAuthProcessResDTO })
  login(@Param('provider', new ParseEnumPipe(OAuthProvider)) provider: OAuthProvider, @Query() query: OAuthLoginReqDTO, @Res() res: Response) {
    const redirectUrl = this.oauthService.login(provider, query);

    res.redirect(HttpStatus.FOUND, redirectUrl);
  }

  @Get(':provider/process')
  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'OAuth2.0 인증 처리' })
  @ApiPermanentRedirectResponse({ type: OAuthProcessResDTO })
  async process(@Param('provider', new ParseEnumPipe(OAuthProvider)) provider: OAuthProvider, @Query() query: OAuthProcessReqDTO, @Res() res: Response) {
    const redirectUrl = await this.oauthService
      .process(provider, query)
      .then((authToken) => `${query.state}?authToken=${authToken}`)
      .catch((e: Error) => `${query.state}?error=${e.message}`);

    res.redirect(HttpStatus.MOVED_PERMANENTLY, redirectUrl);
  }
}
