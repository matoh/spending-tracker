import { Metadata } from 'next';
import { Reports } from '@/components/reports/reports';

export const metadata: Metadata = {
  title: 'Reports'
};

export default async function Page() {
  return <Reports />;
}
