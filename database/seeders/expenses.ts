import { Insertable } from 'kysely';
import { Expenses } from 'kysely-codegen/dist/db';

export const expenses: Insertable<Expenses>[] = [
  {
    merchant: 'Ikea',
    description: 'PAX Wardrobes With Doors',
    category: 'materials',
    cost_sek: 1000,
    cost_eur: 100,
    date: new Date()
  },
  {
    merchant: 'Ikea',
    description: 'Doors',
    category: 'materials',
    cost_sek: 100,
    cost_eur: 10,
    date: new Date()
  },
  {
    merchant: 'Ikea',
    description: 'Door handles',
    category: 'materials',
    cost_sek: 250,
    cost_eur: 25,
    date: new Date()
  },
  {
    merchant: 'Lidl',
    description: 'Gloceries',
    category: 'meals',
    cost_sek: 900,
    cost_eur: 90,
    date: new Date()
  },
  {
    merchant: 'Biltema',
    description: 'Varmkorv',
    category: 'meals',
    cost_sek: 10,
    cost_eur: 1,
    date: new Date()
  }
];
