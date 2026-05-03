import { VideoDownloadPlatform } from '@apps/api/shared';

export interface DownloadVideoInput {
  userId: string;
  platform: VideoDownloadPlatform;
  origin: string;
}
