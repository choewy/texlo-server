import { Voice } from '../domain';

export type GetVoiceParams = {
  page: number;
  take: number;
  userId?: string;
};

export interface VoiceRepository {
  find(params: GetVoiceParams): Promise<[Voice[], number]>;
}
