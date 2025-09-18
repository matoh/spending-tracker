import { ExpenseCategories } from '@/types/expense-categories';
import { ExpenseCurrencies } from '@/types/expense-currencies';
import { z } from 'zod';

export const expenseSchema = z.object({
  merchant: z.string().min(1),
  date: z.date(),
  input_amount: z.transform(Number).pipe(z.number()),
  input_currency: z.enum(ExpenseCurrencies),
  base_currency: z.enum(ExpenseCurrencies),
  base_amount: z.number(),
  category: z.enum(ExpenseCategories),
  description: z.string().optional(),
  report_id: z.number()
});

export type ExpenseSchema = z.infer<typeof expenseSchema>;
