import { Dashboard } from '@/components/dashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | Spending Tracker'
};

export default function Home() {
  return <Dashboard />;
}
