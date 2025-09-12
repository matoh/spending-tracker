import { expenseCategories } from '@/types/expense-categories';
import { z } from 'zod';

export const expenseSchema = z.object({
  merchant: z.string().min(1),
  date: z.date(),
  input_amount: z.number().gt(0),
  input_currency: z.string().length(3),
  category: z.enum(expenseCategories),
  description: z.string().optional()
});

export type ExpenseSchema = z.infer<typeof expenseSchema>;
