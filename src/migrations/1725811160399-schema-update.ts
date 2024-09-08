import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1725811160399 implements MigrationInterface {
    name = 'SchemaUpdate1725811160399'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "school" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "status" boolean NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_57836c3fe2f2c7734b20911755e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_typeuser_enum" AS ENUM('Professor', 'Editor', 'Student')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying(100) NOT NULL, "email" character varying(125) NOT NULL, "password" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "status" boolean NOT NULL, "TypeUser" "public"."user_typeuser_enum" NOT NULL DEFAULT 'Professor', "admin" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "post" ("id" SERIAL NOT NULL, "title" character varying(255) NOT NULL, "content" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "is_draft" boolean NOT NULL, "status" boolean NOT NULL, "userId" integer, "schoolId" uuid, CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_school" ("user_id" integer NOT NULL, "school_id" uuid NOT NULL, CONSTRAINT "PK_5172afc81604e4ee779ac570587" PRIMARY KEY ("user_id", "school_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e347864f128a9f86925d43dcc5" ON "user_school" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_179ab87076a96dc0ce035392f0" ON "user_school" ("school_id") `);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_5c1cf55c308037b5aca1038a131" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_2a39546ac8af066d45aa251c863" FOREIGN KEY ("schoolId") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_school" ADD CONSTRAINT "FK_e347864f128a9f86925d43dcc5b" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_school" ADD CONSTRAINT "FK_179ab87076a96dc0ce035392f07" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_school" DROP CONSTRAINT "FK_179ab87076a96dc0ce035392f07"`);
        await queryRunner.query(`ALTER TABLE "user_school" DROP CONSTRAINT "FK_e347864f128a9f86925d43dcc5b"`);
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_2a39546ac8af066d45aa251c863"`);
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_5c1cf55c308037b5aca1038a131"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_179ab87076a96dc0ce035392f0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e347864f128a9f86925d43dcc5"`);
        await queryRunner.query(`DROP TABLE "user_school"`);
        await queryRunner.query(`DROP TABLE "post"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_typeuser_enum"`);
        await queryRunner.query(`DROP TABLE "school"`);
    }

}
