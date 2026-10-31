import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserAndCredential1793411264573 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
            email VARCHAR(255) NOT NULL UNIQUE,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
            updated_at TIMESTAMPTZ,
            deleted_at TIMESTAMPTZ
      )`,
    );
    await queryRunner.query(
      `CREATE TABLE "credential" (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES "user"(id) ON DELETE CASCADE,
            password_hash VARCHAR(255) NOT NULL
        )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "credential"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
