'use client';

import { CurrencyAmount, formatNumber } from '@/components/layout/currency-amount';
import { AnalyticsData, CategoryBreakdownData } from '@/lib/data/analytics';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export function CategoryBreakdownChart({ analyticsData }: { analyticsData: AnalyticsData }) {
  const data = analyticsData.categoryBreakdown.map((item: CategoryBreakdownData) => ({
    category: item.category,
    total_amount: item.total_amount,
    expense_count: item.expense_count
  }));

  if (data.length === 0) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-sm text-muted-foreground'>No category data available for the selected period</div>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='text-sm text-muted-foreground'>
          Total: <CurrencyAmount amount={analyticsData.totalSpending} />
        </div>
      </div>

      <ResponsiveContainer width='100%' height={300}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray='3 3' className='opacity-30' />
          <XAxis dataKey='category' tick={{ fontSize: 12 }} angle={-45} textAnchor='end' height={80} />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => formatNumber(value, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className='rounded-lg border bg-background p-3 shadow-md'>
                    <p className='font-medium'>{data.category}</p>
                    <p className='text-sm text-muted-foreground'>
                      Amount: <CurrencyAmount amount={data.total_amount} />
                    </p>
                    <p className='text-sm text-muted-foreground'>Expenses: {data.expense_count}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey='total_amount' fill='hsl(var(--primary))' radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
