import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';

import { Job } from 'bullmq';

import { TYPECAST_CLIENT, type TypecastClient } from '@libs/integrations';

import { Voice, VoiceProvider, VoiceSyncLockStatus } from './domain';
import { VOICE_REPOSITORY, VOICE_SYNC_LOCK_REPOSITORY, type VoiceRepository, type VoiceSyncLockRepository } from './repositories';

type VoiceSyncJobData = {
  id: string;
};

type VoiceSyncJob = Job<VoiceSyncJobData, void, VoiceProvider>;

@Processor('voice-sync')
export class VoiceSyncProcessor extends WorkerHost {
  constructor(
    @Inject(VOICE_SYNC_LOCK_REPOSITORY)
    private readonly voiceSyncLockRepository: VoiceSyncLockRepository,
    @Inject(TYPECAST_CLIENT)
    private readonly typecastClient: TypecastClient,
    @Inject(VOICE_REPOSITORY)
    private readonly voiceRepository: VoiceRepository,
  ) {
    super();
  }

  async process(job: VoiceSyncJob): Promise<void> {
    await this.voiceSyncLockRepository.update(job.data.id, VoiceSyncLockStatus.InProgress);

    switch (job.name) {
      case VoiceProvider.Typecast:
        await this.typecast();
        break;

      case VoiceProvider.Supertone:
        break;
    }
  }

  @OnWorkerEvent('completed')
  async onCompleted(job: VoiceSyncJob): Promise<void> {
    await this.voiceSyncLockRepository.update(job.data.id, VoiceSyncLockStatus.Completed);
  }

  @OnWorkerEvent('failed')
  async onFailed(job: VoiceSyncJob | undefined, error: Error): Promise<void> {
    console.log(error);

    if (!job) {
      return;
    }

    await this.voiceSyncLockRepository.update(job.data.id, VoiceSyncLockStatus.Failed);
  }

  private async typecast() {
    const typecastVoices = await this.typecastClient.getVoices();
    const voices = typecastVoices.map((voice) => Voice.fromTypecast(voice));

    if (voices.length === 0) {
      return;
    }

    await this.voiceRepository.upserts(voices);
  }
}
