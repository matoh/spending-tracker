import { PageTitle } from '@/components/layout/layout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reports'
};

export default function Page() {
  return (
    <div>
      <PageTitle text='Reports page' />
    </div>
  );
}
