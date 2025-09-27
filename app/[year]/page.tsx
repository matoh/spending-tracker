import { Dashboard } from '@/components/dashboard/dashboard';
import { getValidYears as getExpenseYears } from '@/lib/data/expenses';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface YearPageProps {
  params: {
    year: string;
  };
}

export async function generateMetadata({ params }: YearPageProps): Promise<Metadata> {
  const awaitParams = await params;
  const year = parseInt(awaitParams.year, 10);

  return {
    title: `Dashboard ${year} | Spending Tracker`
  };
}

export default async function YearPage({ params }: YearPageProps) {
  const awaitParams = await params;
  const year = parseInt(awaitParams.year);

  const validYears = await getExpenseYears();
  if (!validYears.includes(year)) {
    notFound();
  }

  return <Dashboard year={year} />;
}
