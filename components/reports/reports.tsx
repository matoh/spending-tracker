import { CreateReportDialog } from '@/components/reports/create-report-dialog';
import { DeleteReportDialog } from '@/components/reports/delete-report-dialog';
import { EditReportDialog } from '@/components/reports/edit-report-dialog';
import { EmptyState } from '../layout/empty-state';
import { PageTitle } from '../layout/layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { fetchReports } from '@/lib/data';

export async function Reports() {
  const reports = await fetchReports();

  return (
    <div>
      <div className='flex justify-between'>
        <PageTitle text='Reports' />
        {reports.length !== 0 && <CreateReportDialog />}
      </div>
      {reports.length === 0 ? (
        <EmptyState
          title='No reports yet'
          description="Start tracking your spending by adding your first report. It's easy to get started!"
          action={<CreateReportDialog />}
        />
      ) : (
        <Table className='mt-10'>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Total amount</TableHead>
              <TableHead>Total currency</TableHead>
              {/* <TableHead>Status</TableHead> */}
              <TableHead>Creation date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.name}>
                <TableCell>{report.name}</TableCell>
                <TableCell>{report.total_amount}</TableCell>
                <TableCell>{report.total_currency}</TableCell>
                {/* <TableCell>{report.status}</TableCell> */}
                <TableCell>{report.created_at ? report.created_at.toDateString() : ''}</TableCell>
                <TableCell>
                  <div className='flex gap-2'>
                    <EditReportDialog report={report} />
                    <DeleteReportDialog reportId={report.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
