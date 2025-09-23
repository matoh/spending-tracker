import { PageTitle } from '@/components/layout/layout';
import { Settings } from '@/components/settings/settings';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings'
};

export default function Page() {
  return (
    <div className='space-y-6'>
      <PageTitle text='Settings' />
      <Settings />
    </div>
  );
}
