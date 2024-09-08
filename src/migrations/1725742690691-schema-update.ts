import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1725742690691 implements MigrationInterface {
    name = 'SchemaUpdate1725742690691'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_schools_school" ("userId" integer NOT NULL, "schoolId" uuid NOT NULL, CONSTRAINT "PK_eb187de10c39cc11fd525c2c664" PRIMARY KEY ("userId", "schoolId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1cc10b90627a96d082407900ec" ON "user_schools_school" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_672308255926164cca4f904795" ON "user_schools_school" ("schoolId") `);
        await queryRunner.query(`ALTER TABLE "user_schools_school" ADD CONSTRAINT "FK_1cc10b90627a96d082407900ec8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_schools_school" ADD CONSTRAINT "FK_672308255926164cca4f904795c" FOREIGN KEY ("schoolId") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_schools_school" DROP CONSTRAINT "FK_672308255926164cca4f904795c"`);
        await queryRunner.query(`ALTER TABLE "user_schools_school" DROP CONSTRAINT "FK_1cc10b90627a96d082407900ec8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_672308255926164cca4f904795"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1cc10b90627a96d082407900ec"`);
        await queryRunner.query(`DROP TABLE "user_schools_school"`);
    }

}
