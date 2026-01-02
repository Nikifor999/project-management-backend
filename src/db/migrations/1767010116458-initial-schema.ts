import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1767010116458 implements MigrationInterface {
    name = 'InitialSchema1767010116458'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "projects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "description" text, "isArchive" boolean NOT NULL DEFAULT false, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "modified_date" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2187088ab5ef2a918473cb9900" ON "projects" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_6b35e73e223225aa97d84eaa66" ON "projects" ("description") `);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "refresh_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tokenHash" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "revokedAt" TIMESTAMP, "userId" uuid, CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c25bc63d248ca90e8dcc1d92d0" ON "refresh_tokens" ("tokenHash") `);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_361a53ae58ef7034adc3c06f09f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_610102b60fea1455310ccd299de" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_610102b60fea1455310ccd299de"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_361a53ae58ef7034adc3c06f09f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c25bc63d248ca90e8dcc1d92d0"`);
        await queryRunner.query(`DROP TABLE "refresh_tokens"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6b35e73e223225aa97d84eaa66"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2187088ab5ef2a918473cb9900"`);
        await queryRunner.query(`DROP TABLE "projects"`);
    }

}
