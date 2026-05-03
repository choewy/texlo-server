import { Job } from 'bullmq';

export type VideoDownloadJobData = { id: string };
export type VideoDownloadJob = Job<VideoDownloadJobData, void>;
