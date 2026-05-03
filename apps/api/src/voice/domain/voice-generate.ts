import { VoiceGenerateStatus } from '@apps/api/shared';

import { Voice } from './voice';

export class VoiceGenerate {
  id!: string;
  status!: VoiceGenerateStatus;
  url!: string | null;
  text!: string;
  error!: object | null;
  createdAt!: Date;
  updatedAt!: Date;
  userId!: string | null;
  voiceId!: string | null;
  voice!: Voice | null;
}
