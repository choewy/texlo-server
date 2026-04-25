import { Job } from 'bullmq';

export type VoiceSyncJobData = { id: string };
export type VoiceSyncJob = Job<VoiceSyncJobData, void>;
