import { Voice, VoiceProvider } from '../domain';

export interface VoiceRepository {
  findUrls(provider: VoiceProvider, code: string): Promise<Voice | null>;
  upsert(voice: Voice): Promise<void>;
}
