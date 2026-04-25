import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1777095011675 implements MigrationInterface {
  name = 'Migration1777095011675';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "voice_sync_locks" ADD "error" jsonb`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "voice_sync_locks" DROP COLUMN "error"`);
  }
}
