import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1726953507343 implements MigrationInterface {
    name = 'SchemaUpdate1726953507343'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying(100) NOT NULL, "email" character varying(125) NOT NULL, "password" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "status" boolean NOT NULL, "admin" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "school" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "status" boolean NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_57836c3fe2f2c7734b20911755e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_school_association_typeuser_enum" AS ENUM('Professor', 'Editor', 'Student')`);
        await queryRunner.query(`CREATE TABLE "user_school_association" ("id" SERIAL NOT NULL, "status" boolean NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "typeUser" "public"."user_school_association_typeuser_enum" NOT NULL DEFAULT 'Professor', "admin" boolean NOT NULL, "userId" integer, "schoolId" uuid, CONSTRAINT "PK_4ce4d92db29cb09122ad4782368" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "post" ("id" SERIAL NOT NULL, "title" character varying(255) NOT NULL, "content" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "is_draft" boolean NOT NULL, "status" boolean NOT NULL, "userSchoolAssociationId" integer, CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "is_draft" ON "post" ("is_draft") `);
        await queryRunner.query(`ALTER TABLE "user_school_association" ADD CONSTRAINT "FK_a6e5b299c3e579029a19410caf8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_school_association" ADD CONSTRAINT "FK_8767a03fccbf478d506e866feb5" FOREIGN KEY ("schoolId") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_6270347582f8ca30370a0c6d5c5" FOREIGN KEY ("userSchoolAssociationId") REFERENCES "user_school_association"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_6270347582f8ca30370a0c6d5c5"`);
        await queryRunner.query(`ALTER TABLE "user_school_association" DROP CONSTRAINT "FK_8767a03fccbf478d506e866feb5"`);
        await queryRunner.query(`ALTER TABLE "user_school_association" DROP CONSTRAINT "FK_a6e5b299c3e579029a19410caf8"`);
        await queryRunner.query(`DROP INDEX "public"."is_draft"`);
        await queryRunner.query(`DROP TABLE "post"`);
        await queryRunner.query(`DROP TABLE "user_school_association"`);
        await queryRunner.query(`DROP TYPE "public"."user_school_association_typeuser_enum"`);
        await queryRunner.query(`DROP TABLE "school"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
