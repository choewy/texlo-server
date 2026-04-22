import { VoiceAge, VoiceGender, VoiceLanguage, VoiceProvider } from '@libs/persistence';

export class Voice {
  id!: string;
  provider!: VoiceProvider;
  code!: string;
  name!: string;
  imageUrl!: string | null;
  soundUrl!: string | null;
  gender!: VoiceGender | null;
  age!: VoiceAge | null;
  languages!: VoiceLanguage[];
  styles!: string[];
  usecases!: string[];
  likes!: number;
  favorite!: boolean;
}
