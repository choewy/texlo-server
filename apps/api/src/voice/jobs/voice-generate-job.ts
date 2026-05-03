import { Job } from 'bullmq';

export type VoiceGenerateJobData = { id: string };
export type VoiceGenerateJob = Job<VoiceGenerateJobData, void>;
