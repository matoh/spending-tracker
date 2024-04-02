'use server';

import { kyselyConnection } from '@/database/Database';
import { createExpenseSchema } from '@/lib/schemas/expenses';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export async function createExpenseTest(formData: z.infer<typeof createExpenseSchema>) {
  const validatedFields = createExpenseSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to create Expense.'
    };
  }

  try {
    const db = kyselyConnection();
    await db.insertInto('expenses').values(formData).returningAll().execute();
  } catch (error) {
    return {
      message: 'Database Error: Failed to create Expense.'
    };
  }

  revalidatePath('/expenses');
  redirect('/expenses');
}
