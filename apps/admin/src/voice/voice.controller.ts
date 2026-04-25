import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Serializer } from '@libs/http';

import { GetVoicesReqDTO, GetVoicesResDTO } from './dtos';
import { VoiceService } from './voice.service';

@ApiTags('목소리')
@Controller('voices')
export class VoiceController {
  constructor(private readonly voiceService: VoiceService) {}

  @Get()
  @Serializer(GetVoicesResDTO)
  @ApiOperation({ summary: '목소리 목록 조회' })
  @ApiOkResponse({ type: GetVoicesResDTO })
  getVoices(@Query() query: GetVoicesReqDTO) {
    return this.voiceService.getVoices(query);
  }
}
