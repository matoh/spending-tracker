import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BASE_CURRENCY } from '@/lib/constants';
import { PageTitle } from '../layout/layout';

export function Settings() {
  return (
    <div className='space-y-6'>
      <PageTitle text='Settings' />
      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>Currency Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Default Currency</label>
            <div className='text-lg text-gray-900 dark:text-gray-100 mt-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600'>
              {BASE_CURRENCY}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
