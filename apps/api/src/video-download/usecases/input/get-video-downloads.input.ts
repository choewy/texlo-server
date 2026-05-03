import { VideoDownloadPlatform, VideoDownloadStatus } from '@apps/api/shared';

export interface GetVideoDownloadsInput {
  userId: string;
  platform?: VideoDownloadPlatform;
  status?: VideoDownloadStatus;
  page: number;
  take: number;
}
