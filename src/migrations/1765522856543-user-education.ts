import { MigrationInterface, QueryRunner } from "typeorm";

export class UserEducation1765522856543 implements MigrationInterface {
    name = 'UserEducation1765522856543'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_education" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "deleted" TIMESTAMP, "degree" character varying NOT NULL, "institute" character varying NOT NULL, "startYear" integer, "endYear" integer, "userId" uuid, CONSTRAINT "PK_a08c404d196df11dc034f077cf3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_education" ADD CONSTRAINT "FK_98f09242a36729ef251819d19a4" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_education" DROP CONSTRAINT "FK_98f09242a36729ef251819d19a4"`);
        await queryRunner.query(`DROP TABLE "user_education"`);
    }

}
