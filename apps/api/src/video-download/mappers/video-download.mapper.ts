import { VideoDownloadEntity } from '@libs/persistence';

import { VideoDownload } from '../domain';

export class VideoDownloadMapper {
  static toVideoDownload(e: VideoDownloadEntity): VideoDownload {
    const videoDownload = new VideoDownload();

    videoDownload.id = e.id;
    videoDownload.platform = e.platform;
    videoDownload.origin = e.origin;
    videoDownload.title = e.title;
    videoDownload.url = e.url;
    videoDownload.size = e.size;
    videoDownload.status = e.status;
    videoDownload.error = e.error;
    videoDownload.createdAt = e.createdAt;
    videoDownload.updatedAt = e.updatedAt;
    videoDownload.userId = e.userId;

    return videoDownload;
  }
}
