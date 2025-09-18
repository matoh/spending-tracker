import { kyselyConnection } from '@/database/Database';
import { ReportStatus } from '@/types/report-status';
import { Selectable } from 'kysely';
import { Reports } from 'kysely-codegen/dist/db';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchExpenses(reportId?: number) {
  noStore();
  const db = kyselyConnection();

  try {
    let query = db.selectFrom('expenses').selectAll();

    if (reportId) {
      query = query.where('report_id', '=', reportId);
    }

    return await query.limit(100).execute();
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchReports(
  status?: typeof ReportStatus
): Promise<(Selectable<Reports> & { total_amount: string | number | bigint | null })[]> {
  noStore();
  const db = kyselyConnection();

  try {
    let query = db
      .selectFrom('reports')
      .leftJoin('expenses', 'expenses.report_id', 'reports.id')
      .select(['reports.id', 'reports.name', 'reports.status', 'reports.created_at', db.fn.sum('expenses.base_amount').as('total_amount')])
      .groupBy(['reports.id', 'reports.name', 'reports.status', 'reports.created_at']);

    if (status) {
      query = query.where('reports.status', '=', status);
    }

    return await query.orderBy('reports.name', 'desc').execute();
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch reports data.');
  }
}

export async function fetchReport(reportId: number): Promise<(Selectable<Reports> & { total_amount: number }) | undefined> {
  noStore();
  const db = kyselyConnection();

  try {
    const report = await db
      .selectFrom('reports')
      .leftJoin('expenses', 'expenses.report_id', 'reports.id')
      .select(['reports.id', 'reports.name', 'reports.status', 'reports.created_at', db.fn.sum('expenses.base_amount').as('total_amount')])
      .where('reports.id', '=', reportId)
      .groupBy(['reports.id', 'reports.name', 'reports.status', 'reports.created_at'])
      .executeTakeFirst();

    if (!report) {
      return undefined;
    }

    return {
      ...report,
      total_amount: Number(report.total_amount) || 0
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch report data.');
  }
}
