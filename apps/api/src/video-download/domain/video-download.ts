import { VideoDownloadPlatform, VideoDownloadStatus } from '@libs/persistence';

export class VideoDownload {
  id!: string;
  platform!: VideoDownloadPlatform;
  origin!: string;
  title!: string | null;
  url!: string | null;
  thumbnail!: string | null;
  size!: string;
  status!: VideoDownloadStatus;
  error!: object | null;
  createdAt!: Date;
  updatedAt!: Date;
  userId!: string | null;
}
