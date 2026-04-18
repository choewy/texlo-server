import { Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common';

import { WhisperService } from './whisper.service';

@Controller('whisper')
export class WhisperController {
  constructor(private readonly whisperService: WhisperService) {}

  // TODO whisper python worker enqueue(for test)
  @Post('transcribe')
  transcribe() {
    return;
  }

  // TODO whisper python worker callback
  @Post('transcribe/:id')
  transcribeCallback(@Param(':id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return id;
  }
}
