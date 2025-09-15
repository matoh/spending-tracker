'use client';

import { ReportForm } from '@/components/reports/report-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useFormSubmission } from '@/hooks/use-form-submission';
import { useDialogOnCloseFormReset } from '@/hooks/use-dialog-form-reset';
import { updateReport } from '@/lib/actions/reports';
import { ReportSchema, reportSchema } from '@/lib/schemas/reports';
import { zodResolver } from '@hookform/resolvers/zod';
import { Selectable } from 'kysely';
import { Reports } from 'kysely-codegen/dist/db';
import { Edit } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

export function EditReportDialog({ report }: { report: Selectable<Reports> }) {
  const updateReportWithId = updateReport.bind(null, report.id);
  const [openDialog, setOpenDialog] = useState(false);

  const defaultValues = useMemo(() => ({
    name: report.name,
    status: report.status
  }), [report.name, report.status]);

  const form = useForm<ReportSchema>({
    resolver: zodResolver(reportSchema),
    defaultValues
  });

  const handleSubmission = useFormSubmission(form, setOpenDialog);

  async function onSubmit(report: ReportSchema): Promise<void> {
    const response = await updateReportWithId(report);
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
        <Button variant='ghost' size='sm'>
          <Edit />
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Update report</DialogTitle>
        </DialogHeader>
        <ReportForm form={form} onSubmit={onSubmit} action='edit' />
      </DialogContent>
    </Dialog>
  );
}
