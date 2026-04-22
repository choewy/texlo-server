import { Abstract, DynamicModule, ForwardReference, InjectionToken, OptionalFactoryDependency, Provider } from '@nestjs/common';

export type SupertoneOptions = {
  apiKey: string;
};

export type SupertoneModuleOptions = SupertoneOptions;
export type SupertoneModuleAsyncOptions = {
  inject?: (InjectionToken | OptionalFactoryDependency)[];
  useFactory(...args: unknown[]): SupertoneModuleOptions;
};

export type SupertoneModuleProviderMap = {
  providers: Provider[];
  exports: (string | symbol | Provider | Abstract<unknown> | DynamicModule | ForwardReference<unknown>)[];
};

export type SupertoneFormat = 'mp3' | 'wav';
export type SupertoneAge = 'young-adult' | 'child' | 'elder' | 'middle-aged';
export type SupertoneModel = 'sona_speech_1' | 'sona_speech_2';
export type SupertoneStyle = 'neutral';
export type SupertoneGender = 'male' | 'female';
export type SupertoneUsecase =
  | 'meme'
  | 'conversational'
  | 'business'
  | 'narration'
  | 'announcement'
  | 'education'
  | 'game'
  | 'storytelling'
  | 'acting'
  | 'entertainment'
  | 'review'
  | 'short-form'
  | 'audiobook'
  | 'documentary'
  | 'humor'
  | 'advertisement';

export type SupertoneVoiceSample = {
  language: string;
  style: SupertoneStyle;
  model: SupertoneModel;
  url: string;
};

export type SupertoneVoiceItem = {
  voice_id: string;
  name: string;
  description: string;
  age: SupertoneAge;
  gender: SupertoneGender;
  use_case: SupertoneUsecase;
  use_cases: SupertoneUsecase[];
  language: string[];
  styles: SupertoneStyle[];
  models: SupertoneModel[];
  samples: SupertoneVoiceSample[];
  thumbnail_image_url: string;
};

export type SupertoneVoicesResponse = {
  total: number;
  next_page_token: string;
  items: SupertoneVoiceItem[];
};

export type SupertoneVoiceSettings = {
  pitch_shift?: number;
  pitch_variance?: number;
  speed?: number;
};

export type SupertoneGenerateOptions = {
  language?: string;
  style?: SupertoneStyle;
  model?: SupertoneModel;
  pitchShift?: number;
  pitchVariance?: number;
  speed?: number;
  format?: 'wav' | 'mp3';
};

export type SupertoneGenerateRequestBody = {
  text: string;
  language?: string;
  style?: SupertoneStyle;
  model?: SupertoneModel;
  voice_settings?: SupertoneVoiceSettings;
};

export type SupertoneGenerateResponse = {
  duration: number;
  buffer: Buffer;
};
