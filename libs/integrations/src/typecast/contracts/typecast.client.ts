import { TypecastGenerateOptions, TypecastVoiceItem } from '../types';

export interface TypecastClient {
  getVoices(): Promise<TypecastVoiceItem[]>;
  generate(code: string, text: string, { tempo, pitch, emotionLabel }: TypecastGenerateOptions): Promise<Buffer>;
}
