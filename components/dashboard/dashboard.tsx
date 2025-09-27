import { SpendingStatistics } from '@/components/dashboard/spending-statistics';
import { SpendingYearSelector } from '@/components/dashboard/spending-year-selector';
import { PageTitle } from '@/components/layout/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAnalyticsData } from '@/lib/data/analytics';
import { getExpensesCount, getValidYears } from '@/lib/data/expenses';
import { getReportsCount } from '@/lib/data/reports';

interface DashboardProps {
  year?: number;
}

export async function Dashboard({ year }: DashboardProps = {}) {
  const selectedYear = year || new Date().getFullYear();
  const [expensesCount, reportsCount, analyticsData, validYears] = await Promise.all([
    getExpensesCount(),
    getReportsCount(),
    getAnalyticsData(selectedYear),
    getValidYears()
  ]);

  return (
    <>
      <div className='flex items-center justify-between'>
        <PageTitle text='Dashboard' />
        <SpendingYearSelector validYears={validYears} selectedYear={selectedYear} />
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-2 mt-6'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{expensesCount}</div>
            <CardDescription className='text-xs text-muted-foreground'>All recorded expenses</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{reportsCount}</div>
            <CardDescription className='text-xs text-muted-foreground'>All generated reports</CardDescription>
          </CardContent>
        </Card>
      </div>

      <div className='mt-4'>
        <SpendingStatistics analyticsData={analyticsData} selectedYear={selectedYear} />
      </div>
    </>
  );
}
