import { Expenses } from '@/components/expenses/expenses';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Expenses'
};

interface PageProps {
  searchParams: {
    page?: string;
  };
}

export default async function Page({ searchParams }: PageProps) {
  const currentPage = parseInt(searchParams.page || '1', 10);
  return <Expenses currentPage={currentPage} />;
}
