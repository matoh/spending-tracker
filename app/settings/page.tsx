import { PageTitle } from '@/components/layout/layout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings'
};

export default function Page() {
  return (
    <div>
      <PageTitle text='Settings page' />
    </div>
  );
}
