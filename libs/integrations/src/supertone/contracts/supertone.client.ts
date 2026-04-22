import { SupertoneGenerateOptions, SupertoneVoiceItem, SupertoneVoicesResponse } from '../types';

export interface SupertoneClient {
  getVoices(nextPageToken?: string): Promise<SupertoneVoicesResponse>;
  getAllVoices(): Promise<SupertoneVoiceItem[]>;
  generate(code: string, text: string, options: SupertoneGenerateOptions): Promise<Buffer>;
}
