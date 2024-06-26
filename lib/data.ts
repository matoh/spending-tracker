import { kyselyConnection } from '@/database/Database';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchExpenses() {
  noStore();
  const db = kyselyConnection();

  try {
    return await db.selectFrom('expenses').selectAll().limit(10).execute();
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}
