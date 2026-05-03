import { VoiceGenerate } from '../domain';

export interface VoiceGenerateRepository {
  findOneById(id: string): Promise<VoiceGenerate | null>;
  insert(params: Pick<VoiceGenerate, 'text' | 'voiceId' | 'userId'>): Promise<VoiceGenerate>;
  deleteById(id: string): Promise<void>;
}
