import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1777809767786 implements MigrationInterface {
  name = 'Migration1777809767786';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."voice_generates_status_enum" AS ENUM('pending', 'in-progress', 'failed', 'completed')`);
    await queryRunner.query(
      `CREATE TABLE "voice_generates" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."voice_generates_status_enum" NOT NULL DEFAULT 'pending', "url" character varying(1024), "text" text NOT NULL, "size" bigint NOT NULL DEFAULT '0', "error" jsonb, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" uuid, "voice_id" uuid, CONSTRAINT "VOICE_GENERATES" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "voice_generates" ADD CONSTRAINT "VOICE_GENERATES_USER_FK" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "voice_generates" ADD CONSTRAINT "VOICE_GENERATES_VOICE_FK" FOREIGN KEY ("voice_id") REFERENCES "voices"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "voice_generates" DROP CONSTRAINT "VOICE_GENERATES_VOICE_FK"`);
    await queryRunner.query(`ALTER TABLE "voice_generates" DROP CONSTRAINT "VOICE_GENERATES_USER_FK"`);
    await queryRunner.query(`DROP TABLE "voice_generates"`);
    await queryRunner.query(`DROP TYPE "public"."voice_generates_status_enum"`);
  }
}
