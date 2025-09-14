import { DeleteDialog } from '@/components/layout/dialog/delete-dialog';
import { deleteReport } from '@/lib/actions/reports';

export function DeleteReportDialog({ reportId }: { reportId: number }) {
  return <DeleteDialog id={reportId} itemType='report' onDelete={deleteReport} />;
}
