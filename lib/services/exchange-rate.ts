'use server';

import { kyselyConnection as db } from '@/database/Database';

interface ExchangeRateResponse {
  success: boolean;
  rates?: Record<string, number>;
  error?: string;
}

/**
 * Fetch exchange rate from external API
 */
async function fetchExchangeRate(fromCurrency: string, toCurrency: string): Promise<number | null> {
  try {

    // Using exchangerate-api.com (free tier: 1500 requests/month)
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const exchangeRates: ExchangeRateResponse = await response.json();
    if (!exchangeRates.rates || !exchangeRates.rates[toCurrency]) {
      throw new Error('Invalid response from exchange rate API');
    }
    
    return exchangeRates.rates[toCurrency];
  } catch (error) {
    console.error('Failed to fetch exchange rate:', error);
    return null;
  }
}

/**
 * Get exchange rate from cache or fetch from API
 */
export async function getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number | null> {
  // If same currency, return 1
  if (fromCurrency === toCurrency) {
    return 1;
  }

  try {
    // Check if we have a recent rate in cache (within last 24 hours)
    const cachedRate = await db()
      .selectFrom('exchange_rates')
      .select(['rate', 'created_at'])
      .where('from_currency', '=', fromCurrency)
      .where('to_currency', '=', toCurrency)
      .where('created_at', '>', new Date(Date.now() - 24 * 60 * 60 * 1000)) // 24 hours ago
      .orderBy('created_at', 'desc')
      .executeTakeFirst();

    if (cachedRate) {
      return cachedRate.rate;
    }

    // Fetch new rate from API
    const newRate = await fetchExchangeRate(fromCurrency, toCurrency);
    
    if (newRate === null) {
      return null;
    }

    await db()
      .insertInto('exchange_rates')
      .values({
        from_currency: fromCurrency,
        to_currency: toCurrency,
        rate: newRate,
        created_at: new Date()
      })
      .execute();

    return newRate;
  } catch (error) {
    console.error('Failed to get exchange rate:', error);
    return null;
  }
}

/**
 * Convert amount from one currency to another
 */
export async function convertCurrency(
  amount: number, 
  fromCurrency: string, 
  toCurrency: string
): Promise<{ convertedAmount: number; rate: number } | null> {
  const rate = await getExchangeRate(fromCurrency, toCurrency);
  
  if (rate === null) {
    return null;
  }

  return {
    convertedAmount: amount * rate,
    rate: rate
  };
}
