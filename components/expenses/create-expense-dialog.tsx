'use client';

import { ExpenseForm } from '@/components/expenses/expense-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { createExpense } from '@/lib/actions/expenses';
import { ExpenseSchema, expenseSchema } from '@/lib/schemas/expenses';
import { setFormErrors } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export function CreateExpenseDialog() {
  const [openDialog, setOpenDialog] = useState(false);
  const { toast } = useToast();

  const form = useForm<ExpenseSchema>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      merchant: '',
      date: new Date(),
      input_amount: 0,
      input_currency: 'SEK',
      category: undefined,
      description: ''
    }
  });

  async function onSubmit(expense: ExpenseSchema) {
    const response = await createExpense(expense);

    if (response && response.errors) {
      setFormErrors(response.errors, form);
    } else {
      toast({ title: response.status, description: response.message });
      form.reset();
      setOpenDialog(false);
    }
  }

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
