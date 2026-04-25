import { Controller, Get, Inject, Param, ParseEnumPipe, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { Serializer } from '@libs/http';

import { CONTEXT_SERVICE, type ContextService } from '../common';
import { VoiceProvider } from '../shared';

import { GetVoiceSyncLocksReqDTO, GetVoiceSyncLocksResDTO, SyncVoicesResDTO } from './dtos';
import { VoiceSyncService } from './voice-sync.service';

@ApiTags('목소리 동기화')
@Controller('voice-sync')
export class VoiceSyncController {
  constructor(
    @Inject(CONTEXT_SERVICE)
    private readonly contextService: ContextService,
    private readonly voiceSyncService: VoiceSyncService,
  ) {}

  @Get()
  @Serializer(GetVoiceSyncLocksResDTO)
  @ApiOperation({ summary: '목소리 동기화 내역 조회' })
  @ApiOkResponse({ type: GetVoiceSyncLocksResDTO })
  getVoiceSyncLocks(@Query() query: GetVoiceSyncLocksReqDTO) {
    return this.voiceSyncService.getVoiceSyncLocks(query);
  }

  @Post(':provider')
  @Serializer(SyncVoicesResDTO)
  @ApiOperation({ summary: '목소리 동기화' })
  @ApiParam({ name: 'provider', enum: VoiceProvider })
  @ApiCreatedResponse({ type: SyncVoicesResDTO })
  syncVoices(@Param('provider', new ParseEnumPipe(VoiceProvider)) provider: VoiceProvider) {
    return this.voiceSyncService.syncVoices({ provider, adminId: this.contextService.user.id });
  }
}
