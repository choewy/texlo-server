import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { YoutubeVideoDownloadProcessor } from './processors';
import { TypeOrmVideoDownloadRepository, VIDEO_DOWNLOAD_REPOSITORY } from './repositories';

@Module({
  imports: [BullModule.registerQueue({ name: 'video-download.youtube' })],
  providers: [
    YoutubeVideoDownloadProcessor,
    {
      provide: VIDEO_DOWNLOAD_REPOSITORY,
      useClass: TypeOrmVideoDownloadRepository,
    },
  ],
})
export class VideoDownloadModule {}
