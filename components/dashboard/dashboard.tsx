import { PageTitle } from '@/components/layout/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchExpensesCount, fetchReportsCount } from '@/lib/data';
import { ExpenseAnalytics } from '@/components/dashboard/analytics/expense-analytics';

export async function Dashboard() {
  const [expensesCount, reportsCount] = await Promise.all([
    fetchExpensesCount(),
    fetchReportsCount()
  ]);

  return (
    <>
      <div className='flex items-center'>
        <PageTitle text='Dashboard' />
      </div>
      
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-2 mt-6'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{expensesCount}</div>
            <CardDescription className='text-xs text-muted-foreground'>
              All recorded expenses
            </CardDescription>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{reportsCount}</div>
            <CardDescription className='text-xs text-muted-foreground'>
              All generated reports
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Section */}
      <div className="mt-8">
        <ExpenseAnalytics />
      </div>
    </>
  );
}
