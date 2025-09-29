import { BASE_CURRENCY } from '@/lib/constants';

export function formatNumber(
  value: number,
  options: { locale?: string; minimumFractionDigits?: number; maximumFractionDigits?: number } = {}
): string {
  const { locale = 'sv-SE', ...formatOptions } = options;
  const defaultOptions = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
  return value.toLocaleString(locale, { ...defaultOptions, ...formatOptions });
}

export function CurrencyAmount({ amount, currency = BASE_CURRENCY }: { amount: number; currency?: string }) {
  return (
    <span className='whitespace-nowrap'>
      {formatNumber(amount)} {currency}
    </span>
  );
}
