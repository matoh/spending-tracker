'use client';

import { CurrencyAmount } from '@/components/layout/currency-amount';
import { YearOverYearData } from '@/lib/data/analytics';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface YearOverYearDataWithGrowth extends YearOverYearData {
  growth: number;
  growthPercentage: number;
}

export function YearOverYearChart({ data: rawData }: { data: YearOverYearData[] }) {
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

  // Transform data for the chart
  const data = rawData.map((item: YearOverYearData) => ({
    year: item.year,
    total_amount: item.total_amount,
    expense_count: item.expense_count
  }));

  if (data.length === 0) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-sm text-muted-foreground'>No year-over-year data available</div>
      </div>
    );
  }

  // Calculate year-over-year growth
  const calculateGrowth = (data: YearOverYearData[]): YearOverYearDataWithGrowth[] => {
    if (data.length < 2) {
      return data.map((item) => ({ ...item, growth: 0, growthPercentage: 0 }));
    }

    return data.map((item, index) => {
      if (index === 0) {
        return { ...item, growth: 0, growthPercentage: 0 };
      }

      const previousYear = data[index - 1];
      const growth = item.total_amount - previousYear.total_amount;
      const growthPercentage = (growth / previousYear.total_amount) * 100;

      return { ...item, growth, growthPercentage };
    });
  };

  const dataWithGrowth = calculateGrowth(data);
  const currentGrowth = dataWithGrowth[dataWithGrowth.length - 1];
  console.log('currentGrowth', currentGrowth);

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='text-sm text-muted-foreground'>{data.length} years of data</div>
        <div className='flex gap-2'>
          <button
            onClick={() => setChartType('bar')}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              chartType === 'bar' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Bar
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              chartType === 'line' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Line
          </button>
        </div>
      </div>

      <ResponsiveContainer width='100%' height={300}>
        {chartType === 'bar' ? (
          <BarChart data={dataWithGrowth} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray='3 3' className='opacity-30' />
            <XAxis dataKey='year' tick={{ fontSize: 12 }} />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => value.toLocaleString('sv-SE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className='rounded-lg border bg-background p-3 shadow-md'>
                      <p className='font-medium'>{data.year}</p>
                      <p className='text-sm text-muted-foreground'>
                        Total: <CurrencyAmount amount={data.total_amount} />
                      </p>
                      <p className='text-sm text-muted-foreground'>Expenses: {data.expense_count}</p>
                      {data.growth !== undefined && (
                        <p className={`text-sm ${data.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          Growth: {data.growth >= 0 ? '+' : ''}
                          <CurrencyAmount amount={data.growth} />({data.growthPercentage >= 0 ? '+' : ''}
                          {data.growthPercentage.toFixed(1)}%)
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey='total_amount' fill='hsl(var(--primary))' radius={[4, 4, 0, 0]} />
          </BarChart>
        ) : (
          <LineChart data={dataWithGrowth} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray='3 3' className='opacity-30' />
            <XAxis dataKey='year' tick={{ fontSize: 12 }} />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => value.toLocaleString('sv-SE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className='rounded-lg border bg-background p-3 shadow-md'>
                      <p className='font-medium'>{data.year}</p>
                      <p className='text-sm text-muted-foreground'>
                        Total: <CurrencyAmount amount={data.total_amount} />
                      </p>
                      <p className='text-sm text-muted-foreground'>Expenses: {data.expense_count}</p>
                      {data.growth !== undefined && (
                        <p className={`text-sm ${data.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          Growth: {data.growth >= 0 ? '+' : ''}
                          <CurrencyAmount amount={data.growth} />({data.growthPercentage >= 0 ? '+' : ''}
                          {data.growthPercentage.toFixed(1)}%)
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type='monotone'
              dataKey='total_amount'
              stroke='hsl(var(--primary))'
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
