import { kyselyConnection } from '@/database/Database';
import { unstable_noStore as noStore } from 'next/cache';

export interface ExpenseFilters {
  reportId?: number;
  page?: number;
  limit?: number;
}

export async function getExpenses({ reportId, page = 1, limit = 50 }: ExpenseFilters) {
  noStore();
  const db = kyselyConnection();

  try {
    let query = db.selectFrom('expenses').selectAll();

    if (reportId) {
      query = query.where('report_id', '=', reportId);
    }

    const offset = (page - 1) * limit;
    return await query
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset)
      .execute();
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch expenses data.');
  }
}

export async function getExpensesCount(reportId?: number) {
  noStore();
  const db = kyselyConnection();

  try {
    let query = db.selectFrom('expenses').select(db.fn.count('id').as('count'));

    if (reportId) {
      query = query.where('report_id', '=', reportId);
    }

    const result = await query.executeTakeFirst();
    return Number(result?.count) || 0;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch expenses count.');
  }
}

export async function getExpenseById(id: number) {
  noStore();
  const db = kyselyConnection();

  try {
    return await db
      .selectFrom('expenses')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch expense data.');
  }
}
