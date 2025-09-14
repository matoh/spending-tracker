import { EmptyState } from '@/components/layout/empty-state';
import { PageTitle } from '@/components/layout/layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reports'
};

export default function Page() {
  const reports = [
    {
      name: '2025/08',
      total: '1000',
      status: 'closed',
      created_at: new Date()
    },
    {
      name: '2025/09',
      total: '2000',
      status: 'open',
      created_at: new Date()
    }
  ];

  return (
    <div>
      <div className='flex justify-between'>
        <PageTitle text='Reports' />
        {/* {reports.length !== 0 && <CreateReportDialog />} */}
      </div>
      {reports.length === 0 ? (
        <EmptyState
          title='No reports yet'
          description="Start tracking your spending by adding your first report. It's easy to get started!"
          action={null}
        />
      ) : (
        <Table className='mt-10'>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Creation date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.name}>
                <TableCell>{report.name}</TableCell>
                <TableCell>{report.total}</TableCell>
                <TableCell>{report.status}</TableCell>
                <TableCell>{report.created_at ? report.created_at.toDateString() : ''}</TableCell>
                <TableCell>
                  <div className='flex gap-2'>
                    {/* <EditReportDialog report={report} />
                    <DeleteReportDialog reportId={report.id} /> */}
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
