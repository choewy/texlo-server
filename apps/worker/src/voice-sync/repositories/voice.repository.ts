import { Voice } from '../domain';

export interface VoiceRepository {
  upserts(voices: Voice[]): Promise<void>;
}
