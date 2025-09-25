import { BASE_CURRENCY } from '@/lib/constants';
import { ExpenseCategories } from '@/types/expense-categories';
import { Selectable } from 'kysely';
import { Expenses, Reports } from 'kysely-codegen/dist/db';
import { CurrencyAmount } from '../layout/currency-amount';
import { PageTitle } from '../layout/layout';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { StatusBadge } from './status-badge';
import { ExpenseAnalytics } from '../dashboard/analytics/expense-analytics';

interface ReportExpensesProps {
  report: Selectable<Reports> & { total_amount: number };
  expenses: Selectable<Expenses>[];
}

export async function ReportExpenses({ report, expenses }: ReportExpensesProps) {
  const expensesByCategory = Object.groupBy(expenses, (expense) => expense.category);

  // Calculate total amount per category
  const categoryTotals = Object.entries(expensesByCategory).map(([category, categoryExpenses]) => ({
    category: category as (typeof ExpenseCategories)[number],
    total: categoryExpenses.reduce((sum, expense) => sum + (expense.base_amount || 0), 0),
    expenses: categoryExpenses
  }));

  // Sort categories according to the order defined in ExpenseCategories
  categoryTotals.sort((a, b) => {
    const indexA = ExpenseCategories.indexOf(a.category);
    const indexB = ExpenseCategories.indexOf(b.category);
    return indexA - indexB;
  });

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href='/reports'>Reports</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{report.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className='flex justify-between items-center mt-5 mb-10'>
        <PageTitle text={report.name} />
        <div className='flex items-center gap-4'>
          <StatusBadge status={report.status as 'open' | 'closed'} />
          <div className='text-sm text-muted-foreground'>Created on {report.created_at?.toLocaleDateString()}</div>
        </div>
      </div>

      {/* Total Amount Summary */}
      <Card className='mb-8'>
        <CardHeader>
          <CardTitle className='text-lg'>Total Amount</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            <CurrencyAmount amount={report.total_amount as number} currency={BASE_CURRENCY} />
          </div>
          <div className='text-sm text-muted-foreground'>
            {expenses.length} expense{expenses.length !== 1 ? 's' : ''} across {categoryTotals.length} categor
            {categoryTotals.length !== 1 ? 'ies' : 'y'}
          </div>
        </CardContent>
      </Card>

      {/* Analytics Section */}
      <div className='mb-8'>
        <ExpenseAnalytics reportId={report.id} />
      </div>

      {/* Category Groups */}
      {categoryTotals.length > 0 ? (
        <div className='space-y-8'>
          {categoryTotals.map(({ category, total, expenses: categoryExpenses }) => (
            <Card key={category}>
              <CardHeader>
                <div className='flex justify-between items-center'>
                  <CardTitle className='text-lg'>{category}</CardTitle>
                  <div className='text-right'>
                    <div className='text-xl font-bold'>
                      <CurrencyAmount amount={total} currency={BASE_CURRENCY} />
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      {categoryExpenses.length} expense{categoryExpenses.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Merchant</TableHead>
                      <TableHead className='text-right'>Amount</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Creation date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categoryExpenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>{expense.merchant}</TableCell>
                        <TableCell className='text-right'>
                          <CurrencyAmount amount={expense.base_amount} currency={BASE_CURRENCY} />
                        </TableCell>
                        <TableCell>{expense.description || '-'}</TableCell>
                        <TableCell>{expense.date.toDateString()}</TableCell>
                        <TableCell>{expense.created_at ? expense.created_at.toDateString() : ''}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className='text-center py-8'>
            <div className='text-muted-foreground'>No expenses found for this report</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
