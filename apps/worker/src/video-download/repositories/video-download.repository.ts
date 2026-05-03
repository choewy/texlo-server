import { VideoDownloadStatus } from '@libs/persistence';

import { VideoDownload } from '../domain';

export type VideoDownloadUpdateParams = {
  status: VideoDownloadStatus;
  error?: object;
  title?: string;
  url?: string;
};

export interface VideoDownloadRepository {
  findOneById(id: string): Promise<VideoDownload | null>;
  update(id: string, params: VideoDownloadUpdateParams): Promise<void>;
}
