import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';

import { AxiosError } from 'axios';

import { STORAGE_CLIENT, type StorageClient, TYPECAST_CLIENT, type TypecastClient } from '@libs/integrations';

import { VoiceGenerateStatus } from '../domain';
import { type VoiceGenerateJob, VoiceGenerateJobReturnValue } from '../jobs';
import { VOICE_GENERATE_REPOSITORY, type VoiceGenerateRepository } from '../repositories';

@Processor('voice-generate.typecast')
export class TypecastVoiceGenerateProcessor extends WorkerHost {
  constructor(
    @Inject(STORAGE_CLIENT)
    private readonly storageClient: StorageClient,
    @Inject(TYPECAST_CLIENT)
    private readonly typecastClient: TypecastClient,
    @Inject(VOICE_GENERATE_REPOSITORY)
    private readonly voiceGenerateRepository: VoiceGenerateRepository,
  ) {
    super();
  }

  async process(job: VoiceGenerateJob): Promise<VoiceGenerateJobReturnValue | null> {
    const voiceGenerate = await this.voiceGenerateRepository.findOneById(job.data.id);

    if (!voiceGenerate || !voiceGenerate.voice) {
      return null;
    }

    await this.voiceGenerateRepository.update(job.data.id, { status: VoiceGenerateStatus.InProgress });
    const buffer = await this.typecastClient.generate(voiceGenerate.voice.code, voiceGenerate.text, { tempo: 1, pitch: 0 });
    const { url, size } = await this.storageClient.uploadBuffer(buffer);

    return { url, size };
  }

  @OnWorkerEvent('completed')
  async onCompleted(job: VoiceGenerateJob): Promise<void> {
    await this.voiceGenerateRepository.update(job.data.id, {
      url: job.returnvalue?.url,
      size: job.returnvalue?.size,
      status: VoiceGenerateStatus.Completed,
    });
  }

  @OnWorkerEvent('failed')
  async onFailed(job: VoiceGenerateJob, e: Error | AxiosError): Promise<void> {
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

    await this.voiceGenerateRepository.update(job.data.id, {
      error,
      status: VoiceGenerateStatus.Failed,
    });
  }
}
