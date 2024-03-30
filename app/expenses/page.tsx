import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fetchExpenses } from '@/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Expenses'
};

export default async function Page() {
  const expenses = await fetchExpenses();

  return (
    <div>
      <h2>Expense page</h2>
      <Table className='mt-4'>
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
              <TableCell>{expense.cost_sek}</TableCell>
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
