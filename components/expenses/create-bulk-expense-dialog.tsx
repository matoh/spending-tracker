'use client';

import { BulkExpenseForm } from '@/components/expenses/bulk-expense-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useDialogOnCloseFormReset } from '@/hooks/use-dialog-form-reset';
import { useFormSubmission } from '@/hooks/use-form-submission';
import { createBulkExpenses } from '@/lib/actions/expenses';
import { BulkExpenseSchema, bulkExpenseSchema } from '@/lib/schemas/expenses';
import { ExpenseCategories } from '@/types/expense-categories';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Selectable } from 'kysely';
import { Reports } from 'kysely-codegen/dist/db';
import { BASE_CURRENCY } from '@/lib/constants';

export function CreateBulkExpenseDialog({ reports }: { reports: Selectable<Reports>[] }) {
  const [openDialog, setOpenDialog] = useState(false);

  const defaultValues = useMemo(
    (): BulkExpenseSchema => ({
      expenses: [
        {
          merchant: '',
          date: new Date(),
          input_amount: 0,
          input_currency: BASE_CURRENCY,
          base_amount: 0,
          base_currency: BASE_CURRENCY,
          category: '' as (typeof ExpenseCategories)[number],
          description: '',
          report_id: reports[0]?.id
        }
      ]
    }),
    [reports]
  );

  const form = useForm<BulkExpenseSchema>({
    resolver: zodResolver(bulkExpenseSchema),
    defaultValues
  });

  const handleSubmission = useFormSubmission(form, setOpenDialog);

  async function onSubmit(expenses: BulkExpenseSchema) {
    const response = await createBulkExpenses(expenses);
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
        <Button size='sm' variant='outline'>
          Bulk Create
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-6xl max-h-[90vh] overflow-y-auto' aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className='mb-4'>Bulk Create Expenses</DialogTitle>
        </DialogHeader>
        <BulkExpenseForm form={form} onSubmit={onSubmit} reports={reports} />
      </DialogContent>
    </Dialog>
  );
}
