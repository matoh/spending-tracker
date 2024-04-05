import { z } from 'zod';
import { expenseCategories } from '@/types/expense-categories';

export const createExpenseSchema = z.object({
  merchant: z.string().min(1),
  date: z.date(),
  input_amount: z.coerce.number().gt(0),
  input_currency: z.string().length(3),
  category: z.enum(expenseCategories),
  description: z.string().optional()
});