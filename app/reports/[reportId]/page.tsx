import { ReportExpenses } from '@/components/reports/report-expenses';
import { getExpenses } from '@/lib/data/expenses';
import { getReportById } from '@/lib/data/reports';
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
  const report = await getReportById(reportId);

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

  const [report, expenses] = await Promise.all([getReportById(reportId), getExpenses({ reportId, page: 1, limit: 50 })]);

  if (!report) {
    notFound();
  }

  return <ReportExpenses report={report} expenses={expenses} />;
}
