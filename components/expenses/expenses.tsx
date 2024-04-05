import { CreateExpenseDialog } from '@/components/expenses/create-expense-dialog';
import { DeleteExpenseDialog } from '@/components/expenses/delete-expense-dialog';
import { EditExpenseDialog } from '@/components/expenses/edit-expense-dialog';
import { PageTitle } from '@/components/layout/layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fetchExpenses } from '@/lib/data';

export async function Expenses() {
  const expenses = await fetchExpenses();

  return (
    <div>
      <div className='flex justify-between'>
        <PageTitle text='Expense page' />
        <CreateExpenseDialog />
      </div>

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
    </div>
  );
}
