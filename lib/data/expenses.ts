import { kyselyConnection } from '@/database/Database';
import { Selectable, sql } from 'kysely';
import { Expenses } from 'kysely-codegen';
import { unstable_noStore as noStore } from 'next/cache';

export interface ExpenseFilters {
  reportId?: number;
  page?: number;
  limit?: number;
}

/**
 * Get the expenses
 * @param reportId - The report id to filter by
 * @param page - The page number
 * @param limit - The limit of expenses per page
 * @returns The expenses
 */
export async function getExpenses({ reportId, page = 1, limit = 50 }: ExpenseFilters): Promise<Selectable<Expenses>[]> {
  noStore();
  const db = kyselyConnection();

  try {
    let query = db.selectFrom('expenses').selectAll();

    if (reportId) {
      query = query.where('report_id', '=', reportId);
    }

    const offset = (page - 1) * limit;
    return await query.orderBy('created_at', 'desc').limit(limit).offset(offset).execute();
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch expenses data.');
  }
}

/**
 * Get the count of expenses
 * @param reportId - The report id to filter by
 * @returns The count of expenses
 */
export async function getExpensesCount(reportId?: number): Promise<number> {
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

/**
 * Get all years where expenses exist
 * @returns Array of years (as numbers) that have expenses
 */
export async function getValidYears(): Promise<number[]> {
  noStore();
  const db = kyselyConnection();

  try {
    const result = await db
      .selectFrom('expenses')
      .select(sql<number>`EXTRACT(YEAR FROM date)`.as('year'))
      .distinct()
      .execute();

    return result.map((row) => Number(row.year)).sort((a, b) => b - a); // Sort in descending order
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch valid years.');
  }
}
