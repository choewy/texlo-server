import { VoiceAge, VoiceGender, VoiceLanguage, VoiceProvider } from '@apps/api/shared';

export class Voice {
  id!: string;
  provider!: VoiceProvider;
  name!: string;
  code!: string;
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
