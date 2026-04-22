import { Abstract, DynamicModule, ForwardReference, InjectionToken, OptionalFactoryDependency, Provider } from '@nestjs/common';

export type TypecastOptions = {
  apiKey: string;
};

export type TypecastModuleOptions = TypecastOptions;
export type TypecastModuleAsyncOptions = {
  inject?: (InjectionToken | OptionalFactoryDependency)[];
  useFactory(...args: unknown[]): TypecastModuleOptions;
};

export type TypecastModuleProviderMap = {
  providers: Provider[];
  exports: (string | symbol | Provider | Abstract<unknown> | DynamicModule | ForwardReference<unknown>)[];
};

export type TypecastVoiceItem = {
  rid: string;
  name: {
    ko: string;
    en: string;
  };
  version: string;
  language: string;
  price: string;
  order: number;
  roles: string[];
  audio_quality: string;
  img_url: string;
  actor_url: string;
  actor_id: string;
  audio_url: string;
  unique_id: string;
  tuning: string[];
  sex: string[];
  age: string;
  tag: string[];
  flags: string[];
  character_flags: string[];
  style_source: string;
  enhance_speaker: string;
  style_label: {
    default: string[];
    normal: string[];
  };
  style_label_v2: Array<{
    name: string;
    display_name: string;
    aliases: string[];
    end_at: null;
    data: {
      default: string[];
      normal: string[];
    };
    flag: null;
    flags: string[];
  }>;
  speed_params: {
    han: number;
    eng: number;
    digit: number;
    intercept: number;
  };
  dist: {
    resource_url: string;
    card_image_url: string;
    origin_image_url: string;
    base_image_url: null;
    eye_image_url: null;
    lip_image_url: null;
    faceswap_source_url: null;
  };
  tag_v2: {
    tone: string;
    mood: Array<{
      title: string;
      detail: string[];
    }>;
    content: string[];
    category: string[];
  };
  usage: string[];
};

export type TypecastVoicesResponse = {
  result: TypecastVoiceItem[];
};

export type TypecastConvertTextToSpeechRequestBody = {
  actor_id: string;
  adjust_lastword: number;
  bp_c_l: boolean;
  emotion_scale: number;
  expressivity: number;
  lang: string;
  mode: string;
  pitch: number;
  retake: boolean;
  style_label: string;
  style_label_version: string;
  tempo: number;
  text: string;
};

export type TypecastConvertTextToSpeechResponse = {
  result: {
    speak_url: string;
    speak_v2_url: string;
    play_id: string;
  };
};

export type TypecastConvertTextToSpeechResultResponse = {
  result: {
    _id: string;
    status: 'progress' | 'done' | 'failed';
    audio_download_url: string;
    text_count: number;
    audio: {
      url: string;
      extension: 'wav';
    };
  };
};

export type TypecastGenerateOptions = {
  tempo: number;
  pitch: number;
  emotionLabel?: string;
};
