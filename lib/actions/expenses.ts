'use server';

import { kyselyConnection as db } from '@/database/Database';
import { ExpenseSchema, expenseSchema } from '@/lib/schemas/expenses';
import { ActionResponse, ActionStatus } from '@/types/action-response';
import { revalidatePath } from 'next/cache';

/**
 * Create expense from the form data
 * @param formData
 */
export async function createExpense(formData: ExpenseSchema): Promise<ActionResponse> {
  const validatedFields = expenseSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      status: ActionStatus.ERROR,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to create expense.'
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
  return {
    status: ActionStatus.SUCCESS,
    message: 'Expense was successfully created'
  };
}

/**
 * Create expense from the form data
 * @param expenseId
 * @param formData
 */
export async function updateExpense(expenseId: number, formData: ExpenseSchema): Promise<ActionResponse> {
  const validatedFields = expenseSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      status: ActionStatus.ERROR,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to update expense.'
    };
  }

  try {
    await db().updateTable('expenses').set(formData).where('id', '=', Number(expenseId)).returningAll().execute();
  } catch (error) {
    console.log('Database Error: Failed to update expense.', JSON.stringify(error));
    return {
      status: ActionStatus.ERROR,
      message: 'Failed to update Expense.'
    };
  }

  revalidatePath('/expenses');
  return {
    status: ActionStatus.SUCCESS,
    message: 'Expense was successfully updated'
  };
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
