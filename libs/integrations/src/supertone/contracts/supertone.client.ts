import { SupertoneGenerateOptions, SupertoneVoiceItem } from '../types';

export interface SupertoneClient {
  getVoices(nextPageToken?: string): Promise<SupertoneVoiceItem[]>;
  generate(code: string, text: string, options: SupertoneGenerateOptions): Promise<Buffer>;
}
