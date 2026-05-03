import { Body, Controller, Get, Inject, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Serializer } from '@libs/http';

import { CONTEXT_SERVICE, type ContextService } from '../common';

import { GenerateVoiceReqDTO, GenerateVoiceResDTO, GetVoicesReqDTO, GetVoicesResDTO, VoiceGenerateResDTO } from './dtos';
import { VoiceService } from './voice.service';

@ApiTags('목소리')
@Controller('voices')
export class VoiceController {
  constructor(
    @Inject(CONTEXT_SERVICE)
    private readonly contextService: ContextService,
    private readonly voiceService: VoiceService,
  ) {}

  @Get()
  @Serializer(GetVoicesResDTO)
  @ApiOperation({ summary: '목소리 목록 조회' })
  @ApiOkResponse({ type: GetVoicesResDTO })
  getVoices(@Query() query: GetVoicesReqDTO) {
    return this.voiceService.getVoices(query, this.contextService.user.id);
  }

  @Post('generate')
  @Serializer(GenerateVoiceResDTO)
  @ApiOperation({ summary: '목소리 생성' })
  @ApiCreatedResponse({ type: GenerateVoiceResDTO })
  generateVoice(@Body() body: GenerateVoiceReqDTO) {
    return this.voiceService.generateVoice(body, this.contextService.user.id);
  }

  @Get('generate/:id')
  @Serializer(VoiceGenerateResDTO)
  @ApiOperation({ summary: '목소리 생성 이력 조회' })
  @ApiOkResponse({ type: VoiceGenerateResDTO })
  getVoiceGenerate(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.voiceService.getVoiceGenerate(id);
  }
}
