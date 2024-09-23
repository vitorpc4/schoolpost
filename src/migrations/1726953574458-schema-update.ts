import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1726953574458 implements MigrationInterface {
    name = 'SchemaUpdate1726953574458'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "admin"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "admin" boolean NOT NULL DEFAULT false`);
    }

}
