import { CreateExpenseDialog } from '@/components/expenses/create-expense-dialog';
import { DeleteExpenseDialog } from '@/components/expenses/delete-expense-dialog';
import { EditExpenseDialog } from '@/components/expenses/edit-expense-dialog';
import { PageTitle } from '@/components/layout/layout';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fetchExpenses } from '@/lib/data';

export async function Expenses() {
  const expenses = await fetchExpenses();

  return (
    <div>
      <div className='flex justify-between'>
        <PageTitle text='Expense page' />
        {expenses.length !== 0 && <CreateExpenseDialog />}
      </div>

      {expenses.length === 0 ? (
        <Card className='mt-10'>
          <CardContent className='flex flex-col items-center justify-center py-16 px-8'>
            <div className='w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4'>
              <svg
                className='w-8 h-8 text-muted-foreground'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                />
              </svg>
            </div>
            <h3 className='text-lg font-semibold text-foreground mb-2'>No expenses yet</h3>
            <p className='text-muted-foreground text-center mb-6 max-w-sm'>
              Start tracking your spending by adding your first expense. It's easy to get started!
            </p>
            <CreateExpenseDialog />
          </CardContent>
        </Card>
      ) : (
        <Table className='mt-10'>
          <TableHeader>
            <TableRow>
              <TableHead>Merchant</TableHead>
              <TableHead>Input total</TableHead>
              <TableHead>Input currency</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Creation date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{expense.merchant}</TableCell>
                <TableCell>{expense.input_amount}</TableCell>
                <TableCell>{expense.input_currency}</TableCell>
                <TableCell>{expense.category}</TableCell>
                <TableCell>{expense.description}</TableCell>
                <TableCell>{expense.date.toDateString()}</TableCell>
                <TableCell>{expense.created_at ? expense.created_at.toDateString() : ''}</TableCell>
                <TableCell>
                  <div className='flex gap-2'>
                    <EditExpenseDialog expense={expense} />
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
