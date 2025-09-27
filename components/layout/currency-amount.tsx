import { BASE_CURRENCY } from '@/lib/constants';

export function CurrencyAmount({ amount, currency = BASE_CURRENCY }: { amount: number; currency?: string }) {
  return (
    <span className='whitespace-nowrap'>
      {amount.toLocaleString('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
    </span>
  );
}
