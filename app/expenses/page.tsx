import { Expenses } from '@/components/expenses/expenses';
import { getExpenses, getExpensesCount } from '@/lib/data/expenses';
import { getReports } from '@/lib/data/reports';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Expenses'
};

interface PageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const limit = 50;
  const currentPage = parseInt(resolvedSearchParams.page || '1');
  const [expenses, reports, totalCount] = await Promise.all([getExpenses({ page: currentPage, limit }), getReports(), getExpensesCount()]);

  return <Expenses currentPage={currentPage} expenses={expenses} reports={reports} totalCount={totalCount} limit={limit}  />;
}
