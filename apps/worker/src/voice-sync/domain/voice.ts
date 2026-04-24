import { TypecastVoiceItem } from '@libs/integrations';

import { VoiceAge, VoiceGender, VoiceLanguage, VoiceProvider } from './enums';

export class Voice {
  provider!: VoiceProvider;
  code!: string;
  name!: string;
  imageUrl!: string;
  soundUrl!: string;
  gender!: VoiceGender | null;
  age!: VoiceAge | null;
  languages!: VoiceLanguage[];
  models!: string[];
  styles!: string[];
  usecases!: string[];

  static fromTypecast(typecast: TypecastVoiceItem) {
    const voice = new Voice();

    voice.provider = VoiceProvider.Typecast;
    voice.code = typecast.actor_id;
    voice.name = typecast.name.ko;
    voice.imageUrl = typecast.img_url;
    voice.soundUrl = typecast.audio_url;
    voice.gender = this.formatGender(typecast.sex.shift());
    voice.age = this.formatAge(typecast.age);
    voice.languages = [];
    voice.models = [];
    voice.styles = ([] as string[]).concat([typecast.tag_v2?.tone]).concat((typecast.tag_v2?.mood ?? []).flatMap((mood) => [mood.title].concat(mood.detail)));
    voice.usecases = ([] as string[]).concat(typecast.tag_v2?.content ?? []).concat(typecast.tag_v2?.category ?? []);

    return voice;
  }

  private static formatGender(gender?: string) {
    if (!gender) {
      return null;
    }

    if (Object.values(VoiceGender).includes(gender as VoiceGender)) {
      return gender as VoiceGender;
    }

    switch (gender) {
      case '남성':
        return VoiceGender.Male;

      case '여성':
        return VoiceGender.Female;

      default:
        return null;
    }
  }

  private static formatAge(age: string) {
    if (Object.values(VoiceAge).includes(age as VoiceAge)) {
      return age as VoiceAge;
    }

    switch (age) {
      case '아동':
        return VoiceAge.Child;

      case '청소년':
        return VoiceAge.Youth;

      case '청년':
        return VoiceAge.YoungAdult;

      case '중년':
        return VoiceAge.MiddleAged;

      case '장년':
        return VoiceAge.Elder;

      default:
        return null;
    }
  }
}
