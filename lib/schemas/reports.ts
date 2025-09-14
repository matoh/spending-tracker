import { ExpenseCurrencies } from '@/types/expense-currencies';
import { z } from 'zod';

export const reportSchema = z.object({
  name: z.string().min(1)
});

export type ReportSchema = z.infer<typeof reportSchema>;
