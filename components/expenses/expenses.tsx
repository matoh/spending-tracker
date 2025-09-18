import { DeleteExpenseDialog } from '@/components/expenses/delete-expense-dialog';
import { EditExpenseDialog } from '@/components/expenses/edit-expense-dialog';
import { EmptyState } from '@/components/layout/empty-state';
import { PageTitle } from '@/components/layout/layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fetchExpenses, fetchReports } from '@/lib/data';
import { CreateExpenseDialog } from './create-expense-dialog';

export async function Expenses() {
  const [expenses, reports] = await Promise.all([fetchExpenses(), fetchReports()]);

  const openReports = reports.filter((report) => report.status === 'open');

  // Create a map of report IDs to report names for quick lookup
  const reportMap = new Map(reports.map((report) => [report.id, report.name]));

  return (
    <div>
      <div className='flex justify-between'>
        <PageTitle text='Expenses' />
        {expenses.length !== 0 && <CreateExpenseDialog reports={openReports} />}
      </div>

      {expenses.length === 0 ? (
        <EmptyState
          title='No expenses yet'
          description="Start tracking your spending by adding your first expense. It's easy to get started!"
          action={<CreateExpenseDialog reports={openReports} />}
        />
      ) : (
        <Table className='mt-10'>
          <TableHeader>
            <TableRow>
              <TableHead>Merchant</TableHead>
              <TableHead className='text-right'>Input total</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Report</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Creation date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{expense.merchant}</TableCell>
                <TableCell className='text-right'>{expense.input_amount} {expense.input_currency}</TableCell>
                <TableCell>{expense.category}</TableCell>
                <TableCell>{expense.description || '-'}</TableCell>
                <TableCell>{reportMap.get(expense.report_id)}</TableCell>
                <TableCell>{expense.date.toDateString()}</TableCell>
                <TableCell>{expense.created_at ? expense.created_at.toDateString() : ''}</TableCell>
                <TableCell>
                  <div className='flex gap-2'>
                    <EditExpenseDialog expense={expense} reports={openReports} />
                    <DeleteExpenseDialog expenseId={expense.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
