'use client';

import { ReportForm } from '@/components/reports/report-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useDialogOnCloseFormReset } from '@/hooks/use-dialog-form-reset';
import { useFormSubmission } from '@/hooks/use-form-submission';
import { createReport } from '@/lib/actions/reports';
import { ReportSchema, reportSchema } from '@/lib/schemas/reports';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

export function CreateReportDialog() {
  const [openDialog, setOpenDialog] = useState(false);

  const defaultValues = useMemo(() => ({
    name: '',
    status: 'open' as const
  }), []);

  const form = useForm<ReportSchema>({
    resolver: zodResolver(reportSchema),
    defaultValues
  });

  const handleSubmission = useFormSubmission(form, setOpenDialog);

  async function onSubmit(report: ReportSchema) {
    const response = await createReport(report);
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
          <DialogTitle className='mb-4'>New report</DialogTitle>
        </DialogHeader>
        <ReportForm form={form} onSubmit={onSubmit} action='create' />
      </DialogContent>
    </Dialog>
  );
}
