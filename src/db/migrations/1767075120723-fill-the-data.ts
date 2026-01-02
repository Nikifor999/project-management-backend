import { MigrationInterface, QueryRunner } from "typeorm";

export class FillTheData1767075120723 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      
        const userId = '649eef5e-8da2-4daf-a16d-239b46fd462b';

        await queryRunner.query(`
            INSERT INTO "projects" (
                "name", 
                "description", 
                "isArchive", 
                "userId", 
                "created_date", 
                "modified_date"
            ) VALUES 
            (
                'Redesign Corporate Website', 
                'Complete overhaul of the main website using Angular and NestJS. Focus on performance and SEO.', 
                false, 
                '${userId}', 
                DEFAULT, 
                DEFAULT
            ),
            (
                'Mobile App MVP', 
                'Development of the minimum viable product for the iOS and Android tracking app.', 
                false, 
                '${userId}', 
                DEFAULT, 
                DEFAULT
            ),
            (
                'Legacy Database Migration', 
                'Moving old data from MySQL to the new Postgres instance. Need to be careful with types.', 
                true, -- Этот проект в архиве
                '${userId}', 
                DEFAULT, 
                DEFAULT
            ),
            (
                'Q4 Marketing Campaign', 
                'Planning content and ads for the end of the year sale.', 
                false, 
                '${userId}', 
                DEFAULT, 
                DEFAULT
            ),
            (
                'Internal Admin Panel', 
                'Dashboard for managers to view statistics and reports.', 
                false, 
                '${userId}', 
                DEFAULT, 
                DEFAULT
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const userId = '649eef5e-8da2-4daf-a16d-239b46fd462b';
        await queryRunner.query(`DELETE FROM "projects" WHERE "userId" = '${userId}'`);
    }

}