import { kyselyConnection } from '@/database/Database';
import { unstable_noStore as noStore } from 'next/cache';
import { Selectable } from 'kysely';
import { Reports } from 'kysely-codegen/dist/db';

export async function fetchExpenses() {
  noStore();
  const db = kyselyConnection();

  try {
    return await db.selectFrom('expenses').selectAll().limit(100).execute();
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchReports(): Promise<Selectable<Reports>[]> {
  noStore();
  const db = kyselyConnection();

  try {
    return await db.selectFrom('reports').selectAll().orderBy('name', 'desc').execute();
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch reports data.');
  }
}