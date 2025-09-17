import { convertCurrency } from '../lib/services/exchange-rate';

async function testExchangeRate() {
  console.log('Testing exchange rate conversion...');
  
  try {
    // Test EUR to SEK conversion
    const result = await convertCurrency(100, 'EUR', 'SEK');
    console.log('Result is', result);
    
    if (result) {
      console.log(`100 EUR = ${result.convertedAmount} SEK (rate: ${result.rate})`);
    } else {
      console.log('Failed to get exchange rate');
    }
    
    // Test SEK to SEK (should be 1:1)
    const sekResult = await convertCurrency(100, 'SEK', 'SEK');
    
    if (sekResult) {
      console.log(`100 SEK = ${sekResult.convertedAmount} SEK (rate: ${sekResult.rate})`);
    } else {
      console.log('Failed to get SEK to SEK rate');
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testExchangeRate();
