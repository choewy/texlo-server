import { VoiceProvider } from '@apps/api/shared';

export interface VoiceGenerateQueueProducer {
  add(provider: VoiceProvider, jobId: string): Promise<void>;
}
