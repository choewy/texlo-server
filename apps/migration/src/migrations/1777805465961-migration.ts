import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1777805465961 implements MigrationInterface {
  name = 'Migration1777805465961';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "video_download" ADD "thumbnail" character varying(1024)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "video_download" DROP COLUMN "thumbnail"`);
  }
}
