import { Kysely, sql } from 'kysely';
import { DB } from 'kysely-codegen';

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable('exchange_rates')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('from_currency', 'char(3)', (col) => col.notNull())
    .addColumn('to_currency', 'char(3)', (col) => col.notNull())
    .addColumn('rate', 'float4', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`NOW()`).notNull())
    .execute();

  // Add index for efficient lookups
  await db.schema
    .createIndex('idx_exchange_rates_currency_pair')
    .on('exchange_rates')
    .columns(['from_currency', 'to_currency', 'created_at'])
    .execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropIndex('idx_exchange_rates_currency_pair').execute();
  await db.schema.dropTable('exchange_rates').execute();
}
