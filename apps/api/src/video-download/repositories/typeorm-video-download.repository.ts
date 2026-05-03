import { Injectable, Optional } from '@nestjs/common';

import { DataSource, EntityManager, Repository } from 'typeorm';

import { VideoDownloadEntity, VideoDownloadStatus } from '@libs/persistence';

import { VideoDownload } from '../domain';
import { VideoDownloadMapper } from '../mappers';

import { FindVideoDownloadParams, VideoDownloadRepository } from './video-download.repository';

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

  async find(params: FindVideoDownloadParams): Promise<[VideoDownload[], number]> {
    const qb = this.repository
      .createQueryBuilder('yd')
      .where('yd.userId = :userId', { userId: params.userId })
      .skip((params.page - 1) * params.take)
      .take(params.take)
      .orderBy('yd.createdAt', 'DESC')
      .addOrderBy('yd.id', 'DESC');

    if (params.platform) {
      qb.andWhere('yd.platform = :platform', { platform: params.platform });
    }

    if (params.status) {
      qb.andWhere('yd.status = :status', { status: params.status });
    }

    const [rows, total] = await qb.getManyAndCount();

    return [rows.map((row) => VideoDownloadMapper.toVideoDownload(row)), total];
  }

  async insert(params: Pick<VideoDownload, 'userId' | 'platform' | 'origin'>): Promise<VideoDownload> {
    const videoDownload = this.repository.create({
      userId: params.userId,
      platform: params.platform,
      origin: params.origin,
      status: VideoDownloadStatus.Pending,
    });

    return VideoDownloadMapper.toVideoDownload(await this.repository.save(videoDownload));
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete({ id });
  }
}
