import { Injectable, Optional } from '@nestjs/common';

import { DataSource, EntityManager, Repository } from 'typeorm';

import { VideoDownloadEntity } from '@libs/persistence';

import { VideoDownload } from '../domain';
import { VideoDownloadMapper } from '../mappers';

import { VideoDownloadRepository, VideoDownloadUpdateParams } from './video-download.repository';

@Injectable()
export class TypeOrmVideoDownloadRepository implements VideoDownloadRepository {
  private readonly repository: Repository<VideoDownloadEntity>;

  constructor(
    dataSource: DataSource,
    @Optional()
    em?: EntityManager,
  ) {
    this.repository = (em ?? dataSource).getRepository(VideoDownloadEntity);
  }

  async findOneById(id: string): Promise<VideoDownload | null> {
    const videoDownload = await this.repository.findOneBy({ id });

    return videoDownload ? VideoDownloadMapper.toVideoDownload(videoDownload) : null;
  }

  async update(id: string, params: VideoDownloadUpdateParams): Promise<void> {
    await this.repository.update(id, {
      url: params.url,
      title: params.title,
      size: params.size,
      error: params.error,
      status: params.status,
      updatedAt: () => 'NOW()',
    });
  }
}
