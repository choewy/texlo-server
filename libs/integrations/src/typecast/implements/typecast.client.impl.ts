import { Inject, Injectable } from '@nestjs/common';

import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

import { TypecastClient } from '../contracts';
import { TYPECAST_OPTIONS } from '../tokens';
import {
  TypecastConvertTextToSpeechResponse,
  TypecastConvertTextToSpeechResultResponse,
  TypecastGenerateOptions,
  type TypecastOptions,
  TypecastVoiceItem,
  TypecastVoicesResponse,
} from '../types';

@Injectable()
export class TypecastClientImpl implements TypecastClient {
  private readonly api: AxiosInstance;

  constructor(
    @Inject(TYPECAST_OPTIONS)
    private readonly options: TypecastOptions,
  ) {
    this.api = axios.create({
      baseURL: 'https://typecast.ai/api',
      headers: {
        Authorization: `Bearer ${this.options.apiKey}`,
      },
    });
  }

  async getVoices(): Promise<TypecastVoiceItem[]> {
    const { data } = await this.api.get<TypecastVoicesResponse>('actor');

    return data.result;
  }

  async generate(code: string, text: string, { tempo, pitch, emotionLabel }: TypecastGenerateOptions): Promise<Buffer> {
    const { data } = await this.api.post<TypecastConvertTextToSpeechResponse>('speak', {
      lang: 'auto',
      actor_id: code,
      xapi_hd: true,
      xapi_audio_format: 'wav',
      emotion_label: emotionLabel,
      emotion_scale: 1,
      expressivity: 0,
      pitch,
      tempo,
      text,
      retake: true,
    });

    return this.getResult(data.result.speak_url);
  }

  private async waitFor(seconds: number): Promise<void> {
    await new Promise<void>((resolve) => setTimeout(resolve, seconds * 1000));
  }

  private async getResult(url: string): Promise<Buffer> {
    const { data } = await this.api.get<TypecastConvertTextToSpeechResultResponse>(url);

    if (data.result.status === 'progress') {
      await this.waitFor(1);

      return this.getResult(url);
    }

    if (data.result.status === 'done') {
      const response = await this.api.get<ArrayBuffer>(data.result.audio.url, { responseType: 'arraybuffer' });

      return Buffer.from(response.data);
    }

    const error = new AxiosError();

    error.response = { data } as AxiosResponse;

    throw error;
  }
}
