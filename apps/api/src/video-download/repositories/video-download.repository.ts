import { VideoDownloadPlatform, VideoDownloadStatus } from '@apps/api/shared';

import { VideoDownload } from '../domain';

export type FindVideoDownloadParams = {
  platform?: VideoDownloadPlatform;
  status?: VideoDownloadStatus;
  page: number;
  take: number;
  userId: string;
};

export interface VideoDownloadRepository {
  find(params: FindVideoDownloadParams): Promise<[VideoDownload[], number]>;
  findOneById(id: string): Promise<VideoDownload | null>;
  insert(params: Pick<VideoDownload, 'userId' | 'platform' | 'origin'>): Promise<VideoDownload>;
  deleteById(id: string): Promise<void>;
}
