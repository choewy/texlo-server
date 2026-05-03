import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1777788335318 implements MigrationInterface {
  name = 'Migration1777788335318';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."video_download_platform_enum" AS ENUM('youtube')`);
    await queryRunner.query(`CREATE TYPE "public"."video_download_status_enum" AS ENUM('pending', 'in-progress', 'failed', 'completed')`);
    await queryRunner.query(
      `CREATE TABLE "video_download" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "platform" "public"."video_download_platform_enum" NOT NULL, "origin" character varying(1024) NOT NULL, "title" character varying(1024), "url" character varying(1024), "status" "public"."video_download_status_enum" NOT NULL DEFAULT 'pending', "error" jsonb, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "VIDEO_DOWNLOADS" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "video_download" ADD CONSTRAINT "VIDEO_DOWNLOADS_USER_FK" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "video_download" DROP CONSTRAINT "VIDEO_DOWNLOADS_USER_FK"`);
    await queryRunner.query(`DROP TABLE "video_download"`);
    await queryRunner.query(`DROP TYPE "public"."video_download_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."video_download_platform_enum"`);
  }
}
