import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProductTable1776014420078 implements MigrationInterface {
    name = 'UpdateProductTable1776014420078'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "quantity" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" ADD "unit" character varying(150) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "unit"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "quantity"`);
    }

}
