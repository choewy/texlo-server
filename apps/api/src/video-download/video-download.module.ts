import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { BullVideoDownloadQueueProducer, VIDEO_DOWNLOAD_QUEUE_PRODUCER } from './producer';
import { TypeOrmVideoDownloadRepository, VIDEO_DOWNLOAD_REPOSITORY } from './repositories';
import { VideoDownloadController } from './video-download.controller';
import { VideoDownloadService } from './video-download.service';

@Module({
  imports: [BullModule.registerQueue({ name: 'video-download.youtube' }), BullModule.registerQueue({ name: 'video-download.vimeo' })],
  controllers: [VideoDownloadController],
  providers: [
    VideoDownloadService,
    {
      provide: VIDEO_DOWNLOAD_REPOSITORY,
      useClass: TypeOrmVideoDownloadRepository,
    },
    {
      provide: VIDEO_DOWNLOAD_QUEUE_PRODUCER,
      useClass: BullVideoDownloadQueueProducer,
    },
  ],
})
export class VideoDownloadModule {}
