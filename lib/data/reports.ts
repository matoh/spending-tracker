import { kyselyConnection } from '@/database/Database';
import { ReportStatus } from '@/types/report-status';
import { Selectable } from 'kysely';
import { Reports } from 'kysely-codegen/dist/db';
import { unstable_noStore as noStore } from 'next/cache';

export interface ReportFilters {
  status?: typeof ReportStatus;
  page?: number;
  limit?: number;
}

export async function getReports({ 
  status, 
  page = 1, 
  limit = 50 
}: ReportFilters = {}): Promise<(Selectable<Reports> & { total_amount: string | number | bigint | null })[]> {
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

    query = query.orderBy('reports.name', 'desc');

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.limit(limit).offset(offset);

    return await query.execute();
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch reports data.');
  }
}

export async function getReportsCount({ status }: { status?: typeof ReportStatus } = {}): Promise<number> {
  noStore();
  const db = kyselyConnection();

  try {
    let query = db.selectFrom('reports').select(db.fn.count('id').as('count'));

    if (status) {
      query = query.where('status', '=', status);
    }

    const result = await query.executeTakeFirst();
    return Number(result?.count) || 0;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch reports count.');
  }
}

export async function getReportById(reportId: number): Promise<(Selectable<Reports> & { total_amount: number }) | undefined> {
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

export async function getReportByName(reportName: string): Promise<Selectable<Reports> | undefined> {
  noStore();
  const db = kyselyConnection();

  try {
    return await db.selectFrom('reports').selectAll().where('name', '=', reportName).executeTakeFirst();
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch report data.');
  }
}
