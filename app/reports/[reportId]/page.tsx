import { ReportExpenses } from '@/components/reports/report-expenses';
import { fetchExpenses, fetchReport } from '@/lib/data';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{
    reportId: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { reportId: reportIdString } = await params;
  const reportId = parseInt(reportIdString);
  const report = await fetchReport(reportId);

  return {
    title: report ? `${report.name} - Expenses` : 'Report Not Found'
  };
}

export default async function Page({ params }: PageProps) {
  const { reportId: reportIdString } = await params;
  const reportId = parseInt(reportIdString);

  if (isNaN(reportId)) {
    notFound();
  }

  const [report, expenses] = await Promise.all([fetchReport(reportId), fetchExpenses(reportId, 1, 50)]);

  if (!report) {
    notFound();
  }

  return <ReportExpenses report={report} expenses={expenses} />;
}
