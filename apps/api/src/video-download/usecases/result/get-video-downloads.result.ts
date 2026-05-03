import { VideoDownload } from '../../domain';

export interface GetVideoDownloadsResult {
  total: number;
  rows: VideoDownload[];
}
