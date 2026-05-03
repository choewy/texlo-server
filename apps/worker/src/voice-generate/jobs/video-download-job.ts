import { Job } from 'bullmq';

export type VoiceGenerateJobReturnValue = { url: string; size: string };
export type VoiceGenerateJobData = { id: string };
export type VoiceGenerateJob = Job<VoiceGenerateJobData, VoiceGenerateJobReturnValue>;
