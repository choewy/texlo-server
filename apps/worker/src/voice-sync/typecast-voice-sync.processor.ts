import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';

import { AxiosError } from 'axios';

import { STORAGE_CLIENT, type StorageClient, TYPECAST_CLIENT, type TypecastClient } from '@libs/integrations';

import { Voice, VoiceSyncLockStatus } from './domain';
import { type VoiceSyncJob } from './jobs';
import { VOICE_REPOSITORY, VOICE_SYNC_LOCK_REPOSITORY, type VoiceRepository, type VoiceSyncLockRepository } from './repositories';

@Processor('voice-sync.typecast')
export class TypecastVoiceSyncProcessor extends WorkerHost {
  private storageUploadSet = new Set<string>();
  private storageRemoveSet = new Set<string>();

  constructor(
    @Inject(VOICE_SYNC_LOCK_REPOSITORY)
    private readonly voiceSyncLockRepository: VoiceSyncLockRepository,
    @Inject(VOICE_REPOSITORY)
    private readonly voiceRepository: VoiceRepository,
    @Inject(STORAGE_CLIENT)
    private readonly storageClient: StorageClient,
    @Inject(TYPECAST_CLIENT)
    private readonly typecastClient: TypecastClient,
  ) {
    super();
  }

  async process(job: VoiceSyncJob): Promise<void> {
    await this.voiceSyncLockRepository.update(job.data.id, VoiceSyncLockStatus.InProgress);

    const raws = await this.typecastClient.getVoices();
    const targets = raws.map((voice) => Voice.fromTypecast(voice));

    if (targets.length === 0) {
      return;
    }

    for (const target of targets) {
      const voice = await this.voiceRepository.findUrls(target.provider, target.code);

      if (voice) {
        const imageUrl = voice.imageUrl ?? '';
        const soundUrl = voice.soundUrl ?? '';

        if (this.storageClient.is(imageUrl)) {
          this.storageRemoveSet.add(imageUrl);
        }

        if (this.storageClient.is(soundUrl)) {
          this.storageRemoveSet.add(soundUrl);
        }
      }

      if (target.imageUrl) {
        const uploadResult = await this.storageClient.uploadUrl(target.imageUrl);
        target.imageUrl = uploadResult.url;
        this.storageUploadSet.add(uploadResult.url);
      }

      if (target.soundUrl) {
        const uploadResult = await this.storageClient.uploadUrl(target.soundUrl);
        target.soundUrl = uploadResult.url;
        this.storageUploadSet.add(uploadResult.url);
      }

      await this.voiceRepository.upsert(target);
    }
  }

  @OnWorkerEvent('completed')
  async onCompleted(job: VoiceSyncJob): Promise<void> {
    await this.voiceSyncLockRepository.update(job.data.id, VoiceSyncLockStatus.Completed);
    await Promise.all(Array.from(this.storageRemoveSet).map((url) => this.storageClient.remove(url))).catch((e) => {
      console.log(e);
    });
  }

  @OnWorkerEvent('failed')
  async onFailed(job: VoiceSyncJob | undefined, e: Error | AxiosError): Promise<void> {
    if (!job) {
      return;
    }

    let error: object;

    switch (true) {
      case e instanceof AxiosError:
        error = {
          name: e.name,
          message: e.message,
          status: e.response?.status,
          data: e.response?.data as unknown,
        };

        break;

      case e instanceof Error:
        error = {
          name: e.name,
          message: e.message,
          stack: e.stack,
          cause: e.cause,
        };

        break;

      case typeof e === 'object':
        error = e;
        break;

      default:
        error = { error: e };
    }

    await this.voiceSyncLockRepository.update(job.data.id, VoiceSyncLockStatus.Failed, error);
    await Promise.all(Array.from(this.storageUploadSet).map((url) => this.storageClient.remove(url))).catch((e) => {
      console.log(e);
    });
  }
}
