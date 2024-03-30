import { kyselyConnection } from '@/database/Database';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchExpenses() {
  noStore();
  const db = kyselyConnection();

  try {
    console.log('Fetching expenses data...');
    const expenses = await db.selectFrom('expenses').selectAll().limit(10).execute();

    return expenses;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}
