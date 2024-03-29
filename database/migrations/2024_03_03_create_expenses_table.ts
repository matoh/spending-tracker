import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('expenses')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('merchant', 'text', (col) => col.notNull())
    .addColumn('description', 'text')
    .addColumn('category', 'text', (col) => col.notNull())
    .addColumn('cost_sek', 'float4', (col) => col.notNull())
    .addColumn('cost_eur', 'float4', (col) => col.notNull())
    .addColumn('date', 'date', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`NOW()`))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('expenses').execute();
}
