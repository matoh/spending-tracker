import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await sql`ALTER TABLE expenses ALTER COLUMN report_id DROP NOT NULL`.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`ALTER TABLE expenses ALTER COLUMN report_id SET NOT NULL`.execute(db);
}
