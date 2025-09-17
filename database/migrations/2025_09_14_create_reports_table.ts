import { ReportStatus } from '../../types/report-status';
import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
  .createType('status')
  .asEnum([...ReportStatus])
  .execute();

  await db.schema
    .createTable('reports')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('total_amount', 'float4')
    .addColumn('total_currency', sql`input_currency`)
    .addColumn('status', sql`status`, (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`NOW()`))
    .execute();

  await db.schema
    .alterTable('expenses')
    .addForeignKeyConstraint('expenses_report_id_fkey', ['report_id'], 'reports', ['id'])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
  .alterTable('expenses')
  .dropConstraint('expenses_report_id_fkey')
  .execute();
  
  await db.schema.dropTable('reports').execute();
  await db.schema.dropType('status').execute();
}