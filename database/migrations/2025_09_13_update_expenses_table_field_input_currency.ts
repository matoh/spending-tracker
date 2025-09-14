import { ExpenseCurrencies } from '@/types/expense-currencies';
import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createType('input_currency')
    .asEnum([...ExpenseCurrencies])
    .execute();

  await db.schema
    .alterTable('expenses')
    .alterColumn('input_currency', (col) => col.setDataType(sql`input_currency USING input_currency::input_currency`))
    .execute();

  await db.schema
    .alterTable('expenses')
    .alterColumn('input_currency', (col) => col.setNotNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('expenses')
    .alterColumn('input_currency', (col) => col.dropNotNull())
    .execute();

  await db.schema
    .alterTable('expenses')
    .alterColumn('input_currency', (col) => col.setDataType(sql`char(3) USING input_currency::text`))
    .execute();
  
  await db.schema.dropType('input_currency').execute();
}
