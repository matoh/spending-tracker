import { Settings } from '@/components/settings/settings';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings'
};

export default function Page() {
  return <Settings />;
}
