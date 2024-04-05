'use server';

import { kyselyConnection as db } from '@/database/Database';
import { createExpenseSchema } from '@/lib/schemas/expenses';
import { ActionResponse, ActionStatus } from '@/types/action-response';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

/**
 * Create expense from the form data
 * @param formData
 */
export async function createExpense(formData: z.infer<typeof createExpenseSchema>): Promise<ActionResponse> {
  const validatedFields = createExpenseSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      status: ActionStatus.ERROR,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to create Expense.'
    };
  }

  try {
    await db().insertInto('expenses').values(formData).returningAll().execute();
  } catch (error) {
    console.log('Database Error: Failed to create expense.', JSON.stringify(error));
    return {
      status: ActionStatus.ERROR,
      message: 'Failed to create Expense.'
    };
  }

  revalidatePath('/expenses');
  redirect('/expenses');
}

/**
 * Delete expense by expense id
 * @param expenseId
 */
export async function deleteExpense(expenseId: number): Promise<ActionResponse> {
  try {
    const deleteResult = await db().deleteFrom('expenses').where('id', '=', Number(expenseId)).executeTakeFirst();
    revalidatePath('/expenses');

    return Number(deleteResult.numDeletedRows) > 0
      ? {
          status: ActionStatus.SUCCESS,
          message: 'Successfully deleted expense'
        }
      : {
          status: ActionStatus.ERROR,
          message: 'Failed to delete expense.'
        };
  } catch (error) {
    console.log('Database Error: Failed to delete expense.', JSON.stringify(error));
    return {
      status: ActionStatus.ERROR,
      message: 'Failed to delete expense.'
    };
  }
}
