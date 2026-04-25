import { VoiceEntity } from '@libs/persistence';

import { Voice } from '../domain';

export class VoiceMapper {
  static toVoice(entity: VoiceEntity): Voice {
    const voice = new Voice();

    voice.id = entity.id;
    voice.provider = entity.provider;
    voice.code = entity.code;
    voice.name = entity.name;
    voice.imageUrl = entity.imageUrl;
    voice.soundUrl = entity.soundUrl;
    voice.gender = entity.gender;
    voice.age = entity.age;
    voice.languages = entity.languages;
    voice.styles = entity.styles;
    voice.usecases = entity.usecases;
    voice.likes = entity.likes;
    voice.enableSync = entity.enableSync;

    return voice;
  }
}
