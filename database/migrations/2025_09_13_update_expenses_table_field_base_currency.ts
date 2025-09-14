import { ExpenseCurrencies } from '@/types/expense-currencies';
import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createType('base_currency')
    .asEnum([...ExpenseCurrencies])
    .execute();

  await db.schema
    .alterTable('expenses')
    .alterColumn('base_currency', (col) => col.setDataType(sql`base_currency USING base_currency::base_currency`))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('expenses')
    .alterColumn('base_currency', (col) => col.setDataType(sql`char(3) USING base_currency::text`))
    .execute();
  
  await db.schema.dropType('base_currency').execute();
}
