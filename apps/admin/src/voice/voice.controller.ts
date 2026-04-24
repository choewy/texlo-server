import { Controller, Inject, Param, ParseEnumPipe, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { CONTEXT_SERVICE, type ContextService } from '../common';
import { VoiceProvider } from '../shared';

import { SyncVoicesResDTO } from './dtos';
import { VoiceService } from './voice.service';

@ApiTags('목소리')
@Controller('voices')
export class VoiceController {
  constructor(
    @Inject(CONTEXT_SERVICE)
    private readonly contextService: ContextService,
    private readonly voiceService: VoiceService,
  ) {}

  @Post('sync/:provider')
  @ApiOperation({ summary: '목소리 목록 동기화' })
  @ApiParam({ name: 'provider', enum: VoiceProvider })
  @ApiCreatedResponse({ type: SyncVoicesResDTO })
  syncVoices(@Param('provider', new ParseEnumPipe(VoiceProvider)) provider: VoiceProvider) {
    return this.voiceService.syncVoices({ provider, adminId: this.contextService.user.id });
  }
}
