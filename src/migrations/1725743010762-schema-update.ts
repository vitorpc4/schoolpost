import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1725743010762 implements MigrationInterface {
    name = 'SchemaUpdate1725743010762'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_school" DROP CONSTRAINT "FK_179ab87076a96dc0ce035392f07"`);
        await queryRunner.query(`ALTER TABLE "user_school" ADD CONSTRAINT "FK_179ab87076a96dc0ce035392f07" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_school" DROP CONSTRAINT "FK_179ab87076a96dc0ce035392f07"`);
        await queryRunner.query(`ALTER TABLE "user_school" ADD CONSTRAINT "FK_179ab87076a96dc0ce035392f07" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
