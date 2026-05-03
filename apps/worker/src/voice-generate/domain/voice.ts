import { VoiceProvider } from './enums';

export class Voice {
  id!: string;
  provider!: VoiceProvider;
  code!: string;
}
