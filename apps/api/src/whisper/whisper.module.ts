import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { WhisperController } from './whisper.controller';
import { WhisperService } from './whisper.service';

@Module({
  imports: [HttpModule],
  controllers: [WhisperController],
  providers: [WhisperService],
})
export class WhisperModule {}
