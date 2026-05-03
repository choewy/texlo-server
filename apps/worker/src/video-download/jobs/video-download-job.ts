import { Job } from 'bullmq';

export type VideoDownloadJobData = { id: string };
export type VideoDownloadJobReturnValue = {
  title: string;
  url: string;
  size: string;
  thumbnail: string | null;
};

export type VideoDownloadJob = Job<VideoDownloadJobData, VideoDownloadJobReturnValue | null>;
