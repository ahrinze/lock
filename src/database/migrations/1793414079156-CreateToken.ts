import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateToken1793414079156 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            CREATE TABLE "token" (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID REFERENCES "user"(id) ON DELETE CASCADE,
                token_hash VARCHAR(255) NOT NULL,
                used_at TIMESTAMPTZ,
                expired_at TIMESTAMPTZ,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`DROP TABLE "token"`);
  }
}
