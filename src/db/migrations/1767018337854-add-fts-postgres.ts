import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProjectsSearchVectorTimestamp implements MigrationInterface {
  name = 'AddFTSPostgres1767018337854'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1) Добавляем вычисляемый (stored) столбец с весами
    await queryRunner.query(`
      ALTER TABLE "projects"
      ADD COLUMN "search_vector" tsvector
      GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce("name", '')), 'A') ||
        setweight(to_tsvector('english', coalesce("description", '')), 'B')
      ) STORED
    `);

    // 2) Создаём GIN-индекс
    await queryRunner.query(`
      CREATE INDEX "projects_search_idx" ON "projects" USING GIN ("search_vector")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "projects_search_idx"`);
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN IF EXISTS "search_vector"`);
  }
}
