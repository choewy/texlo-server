import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1777791287474 implements MigrationInterface {
  name = 'Migration1777791287474';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "video_download" ADD "size" bigint NOT NULL DEFAULT '0'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "video_download" DROP COLUMN "size"`);
  }
}
