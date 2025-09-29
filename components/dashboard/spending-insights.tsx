'use client';

import { CurrencyAmount } from '@/components/layout/currency-amount';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalyticsData } from '@/lib/data/analytics';
import { AlertTriangle, Calendar, DollarSign, FileText, TrendingDown, TrendingUp } from 'lucide-react';

interface SpendingInsightsProps {
  analyticsData: AnalyticsData;
  selectedYear: number;
}

interface InsightCardProps {
  title: string;
  value: React.ReactNode;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  description: string;
}

function InsightCard({ title, value, changeType = 'neutral', icon, description }: InsightCardProps) {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        <div
          className={`p-2 rounded-full ${
            changeType === 'positive'
              ? 'bg-green-100 text-green-600'
              : changeType === 'negative'
                ? 'bg-red-100 text-red-600'
                : 'bg-muted text-muted-foreground'
          }`}
        >
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className='flex items-center space-x-2'>
          <div className='text-2xl font-bold'>{value}</div>
        </div>
        <CardDescription className='text-xs text-muted-foreground mt-1'>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}

export function SpendingInsights({ analyticsData, selectedYear }: SpendingInsightsProps) {
  if (!analyticsData.monthlyTrend || !analyticsData.yearOverYear) {
    return (
      <div className='text-center py-8'>
        <div className='text-sm text-muted-foreground'>No insights available for the selected period</div>
      </div>
    );
  }

  const totalExpenses = analyticsData.monthlyTrend.reduce((sum, month) => sum + month.expense_count, 0);

  // Year-over-year comparison
  const currentYearData = analyticsData.yearOverYear.find((item) => item.year === selectedYear);
  const previousYearData = analyticsData.yearOverYear.find((item) => item.year === selectedYear - 1);

  const hasYearOverYearData = currentYearData && previousYearData;
  const growth = hasYearOverYearData
    ? ((currentYearData.total_amount - previousYearData.total_amount) / previousYearData.total_amount) * 100
    : 0;

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      <InsightCard
        title='Yearly Spending'
        value={<CurrencyAmount amount={analyticsData.totalSpending} />}
        icon={<DollarSign className='h-4 w-4' />}
        description={`Total expenses for ${selectedYear}`}
      />

      <InsightCard
        title='Monthly Average'
        value={<CurrencyAmount amount={analyticsData.averageSpending} />}
        icon={<Calendar className='h-4 w-4' />}
        description='Average spending per month'
      />

      <InsightCard
        title='Year-over-Year Growth'
        value={hasYearOverYearData ? `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%` : 'N/A'}
        changeType={hasYearOverYearData ? (growth > 5 ? 'negative' : growth < -5 ? 'positive' : 'neutral') : 'neutral'}
        icon={
          hasYearOverYearData ? (
            growth > 0 ? (
              <TrendingUp className='h-4 w-4' />
            ) : (
              <TrendingDown className='h-4 w-4' />
            )
          ) : (
            <AlertTriangle className='h-4 w-4' />
          )
        }
        description={hasYearOverYearData ? `Compared to ${selectedYear - 1}` : `Missing data for ${selectedYear - 1}`}
      />

      <InsightCard
        title='Total Yearly Expenses'
        value={totalExpenses.toLocaleString()}
        icon={<FileText className='h-4 w-4' />}
        description={`Number of expenses in ${selectedYear}`}
      />
    </div>
  );
}
