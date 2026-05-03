import { VideoDownloadPlatform, VideoDownloadStatus } from './enums';

export class VideoDownload {
  id!: string;
  platform!: VideoDownloadPlatform;
  origin!: string;
  title!: string | null;
  url!: string | null;
  status!: VideoDownloadStatus;
}
