import { VoiceProvider } from '@apps/admin/shared';

export interface VoiceSyncQueueProducer {
  add(provider: VoiceProvider, jobId: string): Promise<void>;
}
