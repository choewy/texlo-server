import { VideoDownloadPlatform } from '@apps/api/shared';

export interface VideoDownloadQueueProducer {
  add(platform: VideoDownloadPlatform, jobId: string): Promise<void>;
}
