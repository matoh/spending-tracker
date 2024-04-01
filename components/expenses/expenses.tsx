import { CreateExpense } from '@/components/expenses/create-expense';
import { PageTitle } from '@/components/layout/layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fetchExpenses } from '@/lib/data';

export async function Expenses() {
  const expenses = await fetchExpenses();

  return (
    <div>
      <div className='flex justify-between'>
        <PageTitle text='Expense page' />
        <CreateExpense />
      </div>

      <Table className='mt-10'>
        <TableHeader>
          <TableRow>
            <TableHead>Merchant</TableHead>
            <TableHead>Cost SEK</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Creation date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell>{expense.merchant}</TableCell>
              <TableCell>{expense.base_amount}</TableCell>
              <TableCell>{expense.base_currency}</TableCell>
              <TableCell>{expense.category}</TableCell>
              <TableCell>{expense.description}</TableCell>
              <TableCell>{expense.date.toDateString()}</TableCell>
              <TableCell>{expense.created_at ? expense.created_at.toDateString() : ''}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
