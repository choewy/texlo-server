import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1777027322973 implements MigrationInterface {
  name = 'Migration1777027322973';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."admins_status_enum" AS ENUM('pending', 'approved', 'rejected')`);
    await queryRunner.query(
      `CREATE TABLE "admins" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(340) NOT NULL, "password" character varying(255) NOT NULL, "name" character varying(50) NOT NULL, "status" "public"."admins_status_enum" NOT NULL DEFAULT 'pending', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "ADMINS_PK" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "ADMINS_UNIQUE_EMAIL" ON "admins" ("email") `);
    await queryRunner.query(`CREATE TYPE "public"."oauths_provider_enum" AS ENUM('google')`);
    await queryRunner.query(
      `CREATE TABLE "oauths" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "provider" "public"."oauths_provider_enum" NOT NULL, "provider_id" character varying(50) NOT NULL, "profile" jsonb NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, CONSTRAINT "OAUTHS_PK" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "OAUTHS_USER_ID_IDX" ON "oauths" ("user_id") `);
    await queryRunner.query(`CREATE UNIQUE INDEX "OAUTHS_UNIQUE_PROVIDER_ID" ON "oauths" ("provider", "provider_id") `);
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nickname" character varying(50) NOT NULL DEFAULT '', "profile_image_url" character varying(1024), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "USERS_PK" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE TYPE "public"."voice_sync_locks_provider_enum" AS ENUM('typecast', 'supertone')`);
    await queryRunner.query(`CREATE TYPE "public"."voice_sync_locks_status_enum" AS ENUM('pending', 'in-progress', 'failed', 'completed')`);
    await queryRunner.query(
      `CREATE TABLE "voice_sync_locks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "provider" "public"."voice_sync_locks_provider_enum" NOT NULL, "status" "public"."voice_sync_locks_status_enum" NOT NULL DEFAULT 'pending', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "admin_id" uuid, CONSTRAINT "VOICE_SYNC_LOCKS" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "favorite_voices" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "voice_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "FAVORITE_VOICE_PK" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "FAVORITE_VOICES_UNIQUE_KEY" ON "favorite_voices" ("user_id", "voice_id") `);
    await queryRunner.query(`CREATE TYPE "public"."voices_provider_enum" AS ENUM('typecast', 'supertone')`);
    await queryRunner.query(`CREATE TYPE "public"."voices_gender_enum" AS ENUM('male', 'female')`);
    await queryRunner.query(`CREATE TYPE "public"."voices_age_enum" AS ENUM('child', 'youth', 'young-adult', 'middle-aged', 'elder')`);
    await queryRunner.query(
      `CREATE TYPE "public"."voices_languages_enum" AS ENUM('ko-kr', 'en-us', 'ja-jp', 'zh-cn', 'fr-fr', 'de-de', 'es-es', 'it-it', 'pt-pt', 'vi-vn', 'ar-sa', 'bg-bg', 'cs-cz', 'da-dk', 'el-gr', 'et-ee', 'fi-fi', 'hi-in', 'hu-hu', 'id-id', 'nl-nl', 'pl-pl', 'ro-ro', 'ru-ru')`,
    );
    await queryRunner.query(`CREATE TYPE "public"."voices_status_enum" AS ENUM('activated', 'deactivated')`);
    await queryRunner.query(
      `CREATE TABLE "voices" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "provider" "public"."voices_provider_enum" NOT NULL, "code" character varying(50) NOT NULL, "name" character varying(100) NOT NULL, "image_url" character varying(1024), "sound_url" character varying(1024), "gender" "public"."voices_gender_enum", "age" "public"."voices_age_enum", "languages" "public"."voices_languages_enum" array NOT NULL DEFAULT '{}', "models" character varying(30) array NOT NULL DEFAULT '{}', "styles" character varying(30) array NOT NULL DEFAULT '{}', "usecases" character varying(30) array NOT NULL DEFAULT '{}', "likes" integer NOT NULL DEFAULT '0', "status" "public"."voices_status_enum" NOT NULL DEFAULT 'activated', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "VOICES_PK" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "VOICES_SEARCH_IDX" ON "voices" ("created_at", "id") `);
    await queryRunner.query(`CREATE UNIQUE INDEX "VOICES_UNIQUE_PROVIDER_CODE" ON "voices" ("provider", "code") `);
    await queryRunner.query(`ALTER TABLE "oauths" ADD CONSTRAINT "OAUTHS_USER_FK" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(
      `ALTER TABLE "voice_sync_locks" ADD CONSTRAINT "VOICE_SYNC_LOCKS_ADMIN_FK" FOREIGN KEY ("admin_id") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorite_voices" ADD CONSTRAINT "FAVORITE_VOICES_USER_FK" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorite_voices" ADD CONSTRAINT "FAVORITE_VOICES_VOICE_FK" FOREIGN KEY ("voice_id") REFERENCES "voices"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "favorite_voices" DROP CONSTRAINT "FAVORITE_VOICES_VOICE_FK"`);
    await queryRunner.query(`ALTER TABLE "favorite_voices" DROP CONSTRAINT "FAVORITE_VOICES_USER_FK"`);
    await queryRunner.query(`ALTER TABLE "voice_sync_locks" DROP CONSTRAINT "VOICE_SYNC_LOCKS_ADMIN_FK"`);
    await queryRunner.query(`ALTER TABLE "oauths" DROP CONSTRAINT "OAUTHS_USER_FK"`);
    await queryRunner.query(`DROP INDEX "public"."VOICES_UNIQUE_PROVIDER_CODE"`);
    await queryRunner.query(`DROP INDEX "public"."VOICES_SEARCH_IDX"`);
    await queryRunner.query(`DROP TABLE "voices"`);
    await queryRunner.query(`DROP TYPE "public"."voices_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."voices_languages_enum"`);
    await queryRunner.query(`DROP TYPE "public"."voices_age_enum"`);
    await queryRunner.query(`DROP TYPE "public"."voices_gender_enum"`);
    await queryRunner.query(`DROP TYPE "public"."voices_provider_enum"`);
    await queryRunner.query(`DROP INDEX "public"."FAVORITE_VOICES_UNIQUE_KEY"`);
    await queryRunner.query(`DROP TABLE "favorite_voices"`);
    await queryRunner.query(`DROP TABLE "voice_sync_locks"`);
    await queryRunner.query(`DROP TYPE "public"."voice_sync_locks_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."voice_sync_locks_provider_enum"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP INDEX "public"."OAUTHS_UNIQUE_PROVIDER_ID"`);
    await queryRunner.query(`DROP INDEX "public"."OAUTHS_USER_ID_IDX"`);
    await queryRunner.query(`DROP TABLE "oauths"`);
    await queryRunner.query(`DROP TYPE "public"."oauths_provider_enum"`);
    await queryRunner.query(`DROP INDEX "public"."ADMINS_UNIQUE_EMAIL"`);
    await queryRunner.query(`DROP TABLE "admins"`);
    await queryRunner.query(`DROP TYPE "public"."admins_status_enum"`);
  }
}
