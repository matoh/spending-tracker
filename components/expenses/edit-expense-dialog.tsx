'use client';

import { ExpenseForm } from '@/components/expenses/expense-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useFormSubmission } from '@/hooks/use-form-submission';
import { updateExpense } from '@/lib/actions/expenses';
import { ExpenseSchema, expenseSchema } from '@/lib/schemas/expenses';
import { zodResolver } from '@hookform/resolvers/zod';
import { Selectable } from 'kysely';
import { Expenses } from 'kysely-codegen/dist/db';
import { Edit } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export function EditExpenseDialog({ expense }: { expense: Selectable<Expenses> }) {
  const updateExpenseWithId = updateExpense.bind(null, expense.id);
  const [openDialog, setOpenDialog] = useState(false);

  const form = useForm<ExpenseSchema>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      merchant: expense.merchant,
      date: expense.date ? new Date(expense.date) : new Date(),
      input_amount: expense.input_amount,
      input_currency: expense.input_currency,
      category: expense.category,
      description: expense.description || ''
    }
  });
  const handleSubmission = useFormSubmission(form, setOpenDialog);

  async function onSubmit(expense: ExpenseSchema): Promise<void> {
    const response = await updateExpenseWithId(expense);
    handleSubmission(response);
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant='ghost' size='sm'>
          <Edit />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update expense</DialogTitle>
        </DialogHeader>
        <ExpenseForm form={form} onSubmit={onSubmit} action='edit' />
      </DialogContent>
    </Dialog>
  );
}
