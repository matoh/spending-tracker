import { CreateReportDialog } from '@/components/reports/create-report-dialog';
import { DeleteReportDialog } from '@/components/reports/delete-report-dialog';
import { EditReportDialog } from '@/components/reports/edit-report-dialog';
import { StatusBadge } from '@/components/reports/status-badge';
import { BASE_CURRENCY } from '@/lib/constants';
import { fetchReportsPaginated, fetchReportsCount } from '@/lib/data';
import { NotebookText } from 'lucide-react';
import Link from 'next/link';
import { CurrencyAmount } from '../layout/currency-amount';
import { EmptyState } from '../layout/empty-state';
import { PageTitle } from '../layout/layout';
import { PaginationWrapper } from '../layout/pagination-wrapper';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface ReportsProps {
  currentPage: number;
}

export async function Reports({ currentPage }: ReportsProps) {
  const limit = 10;
  const [reports, totalCount] = await Promise.all([
    fetchReportsPaginated(currentPage, limit),
    fetchReportsCount()
  ]);

  // Pagination calculations
  const totalPages = Math.ceil(totalCount / limit);

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
              <TableHead>Status</TableHead>
              <TableHead>Creation date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.name}>
                <TableCell>{report.name}</TableCell>
                <TableCell>
                  <CurrencyAmount amount={(report.total_amount || 0) as number} currency={BASE_CURRENCY} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={report.status} />
                </TableCell>
                <TableCell>{report.created_at ? report.created_at.toDateString() : ''}</TableCell>
                <TableCell>
                  <div className='flex gap-2'>
                    <Link href={`/reports/${report.id}`}>
                      <Button variant='ghost' size='sm' className='cursor-pointer' title='View Expenses'>
                        <NotebookText />
                      </Button>
                    </Link>
                    <EditReportDialog report={report} />
                    <DeleteReportDialog reportId={report.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Pagination */}
      {reports.length > 0 && (
        <PaginationWrapper
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl="/reports"
        />
      )}
    </div>
  );
}
