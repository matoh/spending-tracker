import { Expenses } from '@/components/expenses/expenses';
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
  const currentPage = parseInt(resolvedSearchParams.page || '1', 10);
  return <Expenses currentPage={currentPage} />;
}
