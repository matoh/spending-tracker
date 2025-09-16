'use client';

import { ExpenseForm } from '@/components/expenses/expense-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useDialogOnCloseFormReset } from '@/hooks/use-dialog-form-reset';
import { useFormSubmission } from '@/hooks/use-form-submission';
import { createExpense } from '@/lib/actions/expenses';
import { ExpenseSchema, expenseSchema } from '@/lib/schemas/expenses';
import { ExpenseCategories } from '@/types/expense-categories';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

export function CreateExpenseDialog() {
  const [openDialog, setOpenDialog] = useState(false);

  const defaultValues = useMemo(
    () => ({
      merchant: '',
      date: new Date(),
      input_amount: 0,
      input_currency: 'SEK' as const,
      category: '' as (typeof ExpenseCategories)[number], // Empty string to show as unselected in UI
      description: ''
    }),
    []
  );

  const form = useForm<ExpenseSchema>({
    resolver: zodResolver(expenseSchema),
    defaultValues
  });

  const handleSubmission = useFormSubmission(form, setOpenDialog);

  async function onSubmit(expense: ExpenseSchema) {
    const response = await createExpense(expense);
    handleSubmission(response);
  }
  // Reset form when dialog closes
  useDialogOnCloseFormReset({
    openDialog,
    form,
    resetValues: defaultValues
  });

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button size='sm'>Create</Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className='mb-4'>New expense</DialogTitle>
        </DialogHeader>
        <ExpenseForm form={form} onSubmit={onSubmit} action='create' />
      </DialogContent>
    </Dialog>
  );
}
