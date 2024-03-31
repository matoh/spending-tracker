import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createType('category')
    .asEnum(['Benefits', 'Car', 'Fees', 'Insurance', 'Materials', 'Meals', 'Professional Services', 'Rent', 'Travel', 'Utilities'])
    .execute();

  await db.schema
    .createTable('expenses')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('merchant', 'text', (col) => col.notNull())
    .addColumn('description', 'text')
    .addColumn('category', sql`category`, (col) => col.notNull())
    .addColumn('base_amount', 'float4', (col) => col.notNull())
    .addColumn('base_currency', 'char(3)', (col) => col.notNull())
    .addColumn('input_amount', 'float4', (col) => col.notNull())
    .addColumn('input_currency', 'char(3)', (col) => col.notNull())
    .addColumn('cost_eur', 'float4', (col) => col.notNull())
    .addColumn('date', 'date', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`NOW()`))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('expenses').execute();
}
