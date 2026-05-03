import { VoiceEntity, VoiceGenerateEntity } from '@libs/persistence';

import { Voice, VoiceGenerate } from '../domain';

export class VoiceMapper {
  static toVoice(e: VoiceEntity): Voice {
    const voice = new Voice();

    voice.id = e.id;
    voice.provider = e.provider;
    voice.code = e.code;

    return voice;
  }

  static toVoiceGenerate(e: VoiceGenerateEntity) {
    const voiceGenerate = new VoiceGenerate();

    voiceGenerate.id = e.id;
    voiceGenerate.status = e.status;
    voiceGenerate.url = e.url;
    voiceGenerate.text = e.text;
    voiceGenerate.size = e.size;
    voiceGenerate.error = e.error;
    voiceGenerate.userId = e.userId;
    voiceGenerate.voiceId = e.voiceId;
    voiceGenerate.voice = e.voice ? this.toVoice(e.voice) : null;
    voiceGenerate.createdAt = e.createdAt;
    voiceGenerate.updatedAt = e.updatedAt;

    return voiceGenerate;
  }
}
