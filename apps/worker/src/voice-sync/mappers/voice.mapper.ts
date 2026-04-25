import { VoiceEntity } from '@libs/persistence';

import { Voice } from '../domain';

export class VoiceMapper {
  static toVoiceUrls(entity: VoiceEntity) {
    const voice = new Voice();

    voice.imageUrl = entity.imageUrl;
    voice.soundUrl = entity.soundUrl;

    return voice;
  }
}
