import { kyselyConnection } from '@/database/Database';
import { sql } from 'kysely';
import { unstable_noStore as noStore } from 'next/cache';

export interface MonthlySpendingData {
  month: Date;
  total_amount: number;
  expense_count: number;
}

export interface CategoryBreakdownData {
  category: string;
  total_amount: number;
  expense_count: number;
}

export interface YearOverYearData {
  year: number;
  total_amount: number;
  expense_count: number;
}

export async function getMonthlySpendingTrend(year: number): Promise<MonthlySpendingData[]> {
  noStore();
  const db = kyselyConnection();

  try {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year + 1, 0, 1);

    const result = await db
      .selectFrom('expenses')
      .select([
        sql`date_trunc('month', date)`.as('month'),
        db.fn.sum('base_amount').as('total_amount'),
        db.fn.count('id').as('expense_count')
      ])
      .where('date', '>=', startDate)
      .where('date', '<', endDate)
      .groupBy('month')
      .orderBy('month', 'asc')
      .execute();

    return result.map((row) => ({
      month: new Date(row.month as string | number | Date),
      total_amount: Number(row.total_amount),
      expense_count: Number(row.expense_count)
    }));
  } catch (error) {
    console.error('Database Error details:', error);
    throw new Error(`Failed to fetch monthly spending trend: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getCategoryBreakdown(year: number): Promise<CategoryBreakdownData[]> {
  noStore();
  const db = kyselyConnection();

  try {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year + 1, 0, 1);

    const result = await db
      .selectFrom('expenses')
      .select(['category', db.fn.sum('base_amount').as('total_amount'), db.fn.count('id').as('expense_count')])
      .where('date', '>=', startDate)
      .where('date', '<', endDate)
      .groupBy('category')
      .orderBy('total_amount', 'desc')
      .execute();

    return result.map((row) => ({
      category: row.category,
      total_amount: Number(row.total_amount),
      expense_count: Number(row.expense_count)
    }));
  } catch (error) {
    console.error('Database Error details:', error);
    throw new Error('Failed to fetch category breakdown.');
  }
}

export async function getYearOverYearComparison(): Promise<YearOverYearData[]> {
  noStore();
  const db = kyselyConnection();

  try {
    let result = await db
      .selectFrom('expenses')
      .select([sql`extract(year from date)`.as('year'), db.fn.sum('base_amount').as('total_amount'), db.fn.count('id').as('expense_count')])
      .groupBy('year')
      .orderBy('year', 'asc')
      .execute();

    return result.map((row) => ({
      year: Number(row.year as string | number),
      total_amount: Number(row.total_amount),
      expense_count: Number(row.expense_count)
    }));
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch year over year comparison.');
  }
}

export async function getTotalSpendingForYear(year: number): Promise<number> {
  noStore();
  const db = kyselyConnection();

  try {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year + 1, 0, 1);

    const result = await db
      .selectFrom('expenses')
      .select(db.fn.sum('base_amount').as('total_amount'))
      .where('date', '>=', startDate)
      .where('date', '<', endDate)
      .executeTakeFirst();

    return Number(result?.total_amount) || 0;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch total spending for year ${year}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export interface AnalyticsData {
  monthlyTrend: MonthlySpendingData[];
  categoryBreakdown: CategoryBreakdownData[];
  yearOverYear: YearOverYearData[];
  totalSpending: number;
}

export async function getAnalyticsData(year: number): Promise<AnalyticsData> {
  noStore();

  try {
    const [monthlyTrend, categoryBreakdown, yearOverYear, totalSpending] = await Promise.all([
      getMonthlySpendingTrend(year),
      getCategoryBreakdown(year),
      getYearOverYearComparison(),
      getTotalSpendingForYear(year)
    ]);

    return {
      monthlyTrend,
      categoryBreakdown,
      yearOverYear,
      totalSpending
    };
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    throw new Error('Failed to fetch analytics data');
  }
}
