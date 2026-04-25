import { SupertoneVoiceItem, TypecastVoiceItem } from '@libs/integrations';

import { VoiceAge, VoiceGender, VoiceLanguage, VoiceProvider, VoiceStatus } from './enums';

export class Voice {
  provider!: VoiceProvider;
  code!: string;
  name!: string;
  imageUrl!: string | null;
  soundUrl!: string | null;
  gender!: VoiceGender | null;
  age!: VoiceAge | null;
  languages!: VoiceLanguage[];
  models!: string[];
  styles!: string[];
  usecases!: string[];
  status?: VoiceStatus;
  enableSync!: boolean;

  static fromTypecast(raw: TypecastVoiceItem) {
    const voice = new Voice();
    const language = this.formatLanguage(raw.language);

    voice.provider = VoiceProvider.Typecast;
    voice.code = raw.actor_id;
    voice.name = raw.name.ko;
    voice.imageUrl = raw.img_url;
    voice.soundUrl = raw.audio_url;
    voice.gender = this.formatGender(raw.sex.shift());
    voice.age = this.formatAge(raw.age);
    voice.languages = language ? [language] : [];
    voice.models = raw.style_label_v2.map((label) => label.display_name).sort((a, b) => a.localeCompare(b));
    voice.styles = ([] as string[]).concat([raw.tag_v2?.tone]).concat((raw.tag_v2?.mood ?? []).flatMap((mood) => [mood.title].concat(mood.detail)));
    voice.usecases = ([] as string[]).concat(raw.tag_v2?.content ?? []).concat(raw.tag_v2?.category ?? []);
    voice.status = raw.hidden ? VoiceStatus.Deactivated : undefined;

    return voice;
  }

  static fromSupertone(raw: SupertoneVoiceItem): Voice {
    const voice = new Voice();

    voice.provider = VoiceProvider.Supertone;
    voice.code = raw.voice_id;
    voice.name = raw.name;
    voice.imageUrl = raw.thumbnail_image_url;
    voice.soundUrl =
      raw.samples
        .filter((sample) => sample.language === 'ko')
        .map((sample) => sample.url)
        .sort()
        .pop() ?? null;
    voice.gender = this.formatGender(raw.gender);
    voice.age = this.formatAge(raw.age);
    voice.languages = raw.language.map((language) => this.formatLanguage(language)).filter((language) => language !== null);
    voice.models = raw.models ?? [];
    voice.styles = raw.styles ?? [];
    voice.usecases = raw.use_cases ?? [];

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

  private static formatLanguage(language?: string | null) {
    if (!language) {
      return null;
    }

    const values = Object.values(VoiceLanguage);
    const languageIdx = values.indexOf(language as VoiceLanguage);

    if (languageIdx >= 0) {
      return language as VoiceLanguage;
    }

    const matchIdx = values.findIndex((value) => value.startsWith(language));

    if (matchIdx >= 0) {
      return values[matchIdx];
    }

    return null;
  }
}
