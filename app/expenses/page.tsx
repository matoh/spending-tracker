import { Expenses } from '@/components/expenses/expenses';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Expenses'
};

export default async function Page() {
  return <Expenses />;
}
