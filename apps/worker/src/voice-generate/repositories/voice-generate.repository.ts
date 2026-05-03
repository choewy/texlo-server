import { VoiceGenerate } from '../domain';

export type VoiceGenerateUpdateParams = Partial<Pick<VoiceGenerate, 'status' | 'url' | 'size' | 'error'>>;

export interface VoiceGenerateRepository {
  findOneById(id: string): Promise<VoiceGenerate | null>;
  update(id: string, params: VoiceGenerateUpdateParams): Promise<void>;
}
