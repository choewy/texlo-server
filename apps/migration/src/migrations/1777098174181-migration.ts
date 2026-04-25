import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1777098174181 implements MigrationInterface {
  name = 'Migration1777098174181';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "voice_sync_locks" DROP COLUMN "enable_sync"`);
    await queryRunner.query(`ALTER TABLE "voices" ADD "enable_sync" boolean NOT NULL DEFAULT true`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "voices" DROP COLUMN "enable_sync"`);
    await queryRunner.query(`ALTER TABLE "voice_sync_locks" ADD "enable_sync" boolean NOT NULL DEFAULT true`);
  }
}
