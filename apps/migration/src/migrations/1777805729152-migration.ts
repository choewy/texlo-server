import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1777805729152 implements MigrationInterface {
  name = 'Migration1777805729152';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TYPE "public"."video_download_platform_enum" RENAME TO "video_download_platform_enum_old"`);
    await queryRunner.query(`CREATE TYPE "public"."video_download_platform_enum" AS ENUM('youtube', 'vimeo')`);
    await queryRunner.query(
      `ALTER TABLE "video_download" ALTER COLUMN "platform" TYPE "public"."video_download_platform_enum" USING "platform"::"text"::"public"."video_download_platform_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."video_download_platform_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."video_download_platform_enum_old" AS ENUM('youtube')`);
    await queryRunner.query(
      `ALTER TABLE "video_download" ALTER COLUMN "platform" TYPE "public"."video_download_platform_enum_old" USING "platform"::"text"::"public"."video_download_platform_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."video_download_platform_enum"`);
    await queryRunner.query(`ALTER TYPE "public"."video_download_platform_enum_old" RENAME TO "video_download_platform_enum"`);
  }
}
