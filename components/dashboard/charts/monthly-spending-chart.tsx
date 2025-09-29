'use client';

import { CurrencyAmount, formatNumber } from '@/components/layout/currency-amount';
import { AnalyticsData, MonthlySpendingData } from '@/lib/data/analytics';
import { calculateLinearRegression } from '@/lib/utils';
import { format } from 'date-fns';
import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export function MonthlySpendingChart({ analyticsData }: { analyticsData: AnalyticsData }) {
  if (analyticsData.monthlyTrend.length === 0) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-sm text-muted-foreground'>No spending data available for the selected period</div>
      </div>
    );
  }

  const { trendValues } = calculateLinearRegression(analyticsData.monthlyTrend.map((item) => item.total_amount));
  const dataWithTrend = analyticsData.monthlyTrend.map((item, index) => ({
    ...item,
    trend: trendValues[index]
  }));

  // Transform data for chart display
  const chartData = dataWithTrend.map((item) => ({
    ...item,
    month: format(item.month, 'MMM yyyy')
  }));

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='text-sm text-muted-foreground'>
          Average monthly spending: <CurrencyAmount amount={analyticsData.averageSpending} />
        </div>
        <div className='text-sm text-muted-foreground'>{analyticsData.monthlyTrend.length} months of data</div>
      </div>

      <ResponsiveContainer width='100%' height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray='3 3' className='opacity-30' />
          <XAxis dataKey='month' tick={{ fontSize: 12 }} />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => formatNumber(value, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className='rounded-lg border bg-background p-3 shadow-md'>
                    <p className='font-medium'>{label}</p>
                    <p className='text-sm text-muted-foreground'>
                      Total: <CurrencyAmount amount={payload[0].value || 0} />
                    </p>
                    <p className='text-sm text-muted-foreground'>Expenses: {payload[0].payload?.expense_count}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <ReferenceLine
            y={analyticsData.averageSpending}
            strokeDasharray='2 2'
            label={{ value: 'Average', position: 'top' }}
          />
          <Line
            type='monotone'
            dataKey='total_amount'
            stroke='hsl(var(--primary))'
            strokeWidth={2}
            dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
          />
          <Line
            type='monotone'
            dataKey='trend'
            stroke='hsl(var(--muted-foreground))'
            strokeWidth={1}
            strokeDasharray='5 5'
            dot={false}
            name='Trend'
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
