'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';

interface SpendingYearSelectorProps {
  validYears: number[];
  selectedYear: number;
}

export function SpendingYearSelector({ validYears, selectedYear }: SpendingYearSelectorProps) {
  const router = useRouter();

  return (
    <div className='flex items-center space-x-2'>
      <label htmlFor='year-select' className='text-sm font-medium'>
        Year:
      </label>
      <Select value={selectedYear.toString()} onValueChange={(year) => router.push(`/${year}`)}>
        <SelectTrigger id='year-select' className='w-32'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {validYears.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
