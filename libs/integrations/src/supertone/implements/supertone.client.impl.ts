import { Inject, Injectable } from '@nestjs/common';

import axios, { AxiosError, AxiosInstance } from 'axios';

import { SupertoneClient } from '../contracts';
import { SUPERTONE_OPTIONS } from '../tokens';
import { SupertoneGenerateOptions, type SupertoneOptions, SupertoneVoiceItem, SupertoneVoicesResponse } from '../types';

@Injectable()
export class SupertoneClientImpl implements SupertoneClient {
  private readonly api: AxiosInstance;

  constructor(
    @Inject(SUPERTONE_OPTIONS)
    private readonly options: SupertoneOptions,
  ) {
    this.api = axios.create({
      baseURL: 'https://supertoneapi.com/v1',
      headers: {
        'Content-Type': 'application/json',
        'x-sup-api-key': this.options.apiKey,
      },
    });
  }

  async getVoices(nextPageToken?: string): Promise<SupertoneVoicesResponse> {
    const { data } = await this.api.get<SupertoneVoicesResponse>('https://supertoneapi.com/v1/voices', {
      params: {
        page_size: 100,
        next_page_token: nextPageToken,
      },
    });

    return data;
  }

  async getAllVoices(): Promise<SupertoneVoiceItem[]> {
    let voices: SupertoneVoiceItem[] = [];
    let nextPageToken: string | undefined = undefined;

    do {
      const response = await this.getVoices(nextPageToken);

      voices = voices.concat(response.items.map((item) => ({ ...item, samples: item.samples.filter((sample) => sample.language === 'ko') })));
      nextPageToken = response.next_page_token;
    } while (nextPageToken);

    return voices;
  }

  async generate(code: string, text: string, { language, style, model, pitchShift, pitchVariance, speed, format }: SupertoneGenerateOptions): Promise<Buffer> {
    const response = await this.api
      .post<ArrayBuffer>(
        `https://supertoneapi.com/v1/text-to-speech/${code}`,
        {
          text,
          language: language ?? 'ko',
          model: model ?? 'sona_speech_2',
          style,
          voice_settings: { pitch_shift: pitchShift, pitch_variance: pitchVariance, speed },
        },
        {
          responseType: 'arraybuffer',
          params: { output_format: format ?? 'mp3' },
        },
      )
      .catch((e) => {
        const error = e as AxiosError;

        if (error.response?.data instanceof Buffer) {
          error.response.data = JSON.parse(error.response.data.toString('utf-8'));
        }

        throw error;
      });

    return Buffer.from(response.data);
  }
}
