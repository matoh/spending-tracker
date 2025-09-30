import { DeleteExpenseDialog } from '@/components/expenses/delete-expense-dialog';
import { EditExpenseDialog } from '@/components/expenses/edit-expense-dialog';
import { EmptyState } from '@/components/layout/empty-state';
import { PageTitle } from '@/components/layout/layout';
import { PaginationWrapper } from '@/components/layout/pagination-wrapper';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Selectable } from 'kysely';
import type { Expenses, Reports } from 'kysely-codegen/dist/db';
import { CurrencyAmount } from '../layout/currency-amount';
import { CreateBulkExpenseDialog } from './create-bulk-expense-dialog';
import { CreateExpenseDialog } from './create-expense-dialog';

interface ExpensesProps {
  currentPage: number;
  expenses: Selectable<Expenses>[];
  reports: (Selectable<Reports> & { total_amount: number })[];
  totalCount: number;
  limit: number;
}

export async function Expenses({ currentPage, expenses, reports, totalCount, limit }: ExpensesProps) {
  const openReports = reports.filter((report) => report.status === 'open');

  // Create a map of report IDs to report names for quick lookup
  const reportMap = new Map(reports.map((report) => [report.id, report.name]));

  // Pagination calculations
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div>
      <div className='flex justify-between'>
        <PageTitle text='Expenses' />
        {expenses.length !== 0 && (
          <div className='flex gap-2'>
            <CreateBulkExpenseDialog reports={openReports} />
            <CreateExpenseDialog reports={openReports} />
          </div>
        )}
      </div>

      {expenses.length === 0 ? (
        <EmptyState
          title='No expenses yet'
          description="Start tracking your spending by adding your first expense. It's easy to get started!"
          action={
            <div className='flex gap-2'>
              <CreateBulkExpenseDialog reports={openReports} />
              <CreateExpenseDialog reports={openReports} />
            </div>
          }
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
                <TableCell className='text-right'>
                  <CurrencyAmount amount={expense.input_amount} currency={expense.input_currency} />
                </TableCell>
                <TableCell>{expense.category}</TableCell>
                <TableCell>{expense.description || '-'}</TableCell>
                <TableCell>{expense.report_id ? reportMap.get(expense.report_id) : '-'}</TableCell>
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

      {/* Pagination */}
      {expenses.length > 0 && <PaginationWrapper currentPage={currentPage} totalPages={totalPages} baseUrl='/expenses' />}
    </div>
  );
}
