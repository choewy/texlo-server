import { VideoDownloadEntity } from '@libs/persistence';

import { VideoDownload } from '../domain';

export class VideoDownloadMapper {
  static toVideoDownload(e: VideoDownloadEntity): VideoDownload {
    const videoDownload = new VideoDownload();

    videoDownload.id = e.id;
    videoDownload.platform = e.platform;
    videoDownload.origin = e.origin;
    videoDownload.status = e.status;
    videoDownload.title = e.title;
    videoDownload.url = e.url;

    return videoDownload;
  }
}
