import { Insertable } from 'kysely';
import { Expenses } from 'kysely-codegen/dist/db';

export const expenses: Insertable<Expenses>[] = [
  {
    merchant: 'Ikea',
    description: 'PAX Wardrobes With Doors',
    category: 'Materials',
    base_amount: 1000,
    base_currency: 'SEK',
    input_amount: 1000,
    input_currency: 'SEK',
    date: new Date()
  },
  {
    merchant: 'Ikea',
    description: 'Doors',
    category: 'Materials',
    base_amount: 100,
    base_currency: 'SEK',
    input_amount: 10,
    input_currency: 'EUR',
    date: new Date()
  },
  {
    merchant: 'Ikea',
    description: 'Door handles',
    category: 'Materials',
    base_amount: 500,
    base_currency: 'SEK',
    input_amount: 50,
    input_currency: 'EUR',
    date: new Date()
  },
  {
    merchant: 'Lidl',
    description: 'Gloceries',
    category: 'Meals',
    base_amount: 900,
    base_currency: 'SEK',
    input_amount: 90,
    input_currency: 'EUR',
    date: new Date()
  },
  {
    merchant: 'Biltema',
    description: 'Varmkorv',
    category: 'Meals',
    base_amount: 10,
    base_currency: 'SEK',
    input_amount: 10,
    input_currency: 'SEK',
    date: new Date()
  }
];
