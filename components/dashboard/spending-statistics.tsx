'use client';

import { AnalyticsData } from '@/lib/data/analytics';
import { AnalyticsCard } from './analytics/analytics-card';
import { CategoryBreakdownChart } from './analytics/charts/category-breakdown-chart';
import { MonthlySpendingChart } from './analytics/charts/monthly-spending-chart';
import { YearOverYearChart } from './analytics/charts/year-over-year-chart';
import { SpendingInsights } from './analytics/spending-insights';

interface SpendingStatisticsProps {
  analyticsData: AnalyticsData;
  selectedYear: number;
}

export function SpendingStatistics({ analyticsData, selectedYear }: SpendingStatisticsProps) {
  return (
    <div className='space-y-6'>
      <SpendingInsights analyticsData={analyticsData} selectedYear={selectedYear} />

      <div className='grid gap-6'>
        <div className='grid gap-6 lg:grid-cols-2'>
          <AnalyticsCard title='Monthly Spending Trend' description='Track your spending patterns over time with trend analysis'>
            <MonthlySpendingChart monthlyExpenseData={analyticsData.monthlyTrend} />
          </AnalyticsCard>

          <AnalyticsCard title='Category Breakdown' description='See where your money goes by expense category'>
            <CategoryBreakdownChart data={analyticsData.categoryBreakdown} />
          </AnalyticsCard>
        </div>

        <div className='grid gap-6 lg:grid-cols-2'>
          <AnalyticsCard title='Year-over-Year Comparison' description='Compare your spending across different years'>
            <YearOverYearChart data={analyticsData.yearOverYear} />
          </AnalyticsCard>
        </div>
      </div>
    </div>
  );
}
