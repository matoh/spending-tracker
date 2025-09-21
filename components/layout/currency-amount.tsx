export function CurrencyAmount({ amount, currency }: { amount: number; currency: string }) {
  return (
    <span className='whitespace-nowrap'>
      {amount.toLocaleString('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
    </span>
  );
}
