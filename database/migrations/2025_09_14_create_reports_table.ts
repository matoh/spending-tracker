import { expenseCategories } from '../../types/expense-categories';
import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('reports')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('total_amount', 'float4')
    .addColumn('total_currency', sql`input_currency`)
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`NOW()`))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('reports').execute();
}