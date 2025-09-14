import { DeleteDialog } from '@/components/layout/dialog/delete-dialog';
import { deleteExpense } from '@/lib/actions/expenses';

export function DeleteExpenseDialog({ expenseId }: { expenseId: number }) {
  return <DeleteDialog id={expenseId} itemType='expense' onDelete={deleteExpense} />;
}
