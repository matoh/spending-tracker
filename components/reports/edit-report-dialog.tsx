'use client';

import { ReportForm } from '@/components/reports/report-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useFormSubmission } from '@/hooks/use-form-submission';
import { updateReport } from '@/lib/actions/reports';
import { ReportSchema, reportSchema } from '@/lib/schemas/reports';
import { setFormErrors } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Selectable } from 'kysely';
import { Reports } from 'kysely-codegen/dist/db';
import { Edit } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export function EditReportDialog({ report }: { report: Selectable<Reports> }) {
  const updateReportWithId = updateReport.bind(null, report.id);
  const [openDialog, setOpenDialog] = useState(false);

  const form = useForm<ReportSchema>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      name: report.name
    }
  });

  const handleSubmission = useFormSubmission(form, setOpenDialog);

  async function onSubmit(report: ReportSchema): Promise<void> {
    const response = await updateReportWithId(report);
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
          <DialogTitle>Update report</DialogTitle>
        </DialogHeader>
        <ReportForm form={form} onSubmit={onSubmit} action='edit' />
      </DialogContent>
    </Dialog>
  );
}
