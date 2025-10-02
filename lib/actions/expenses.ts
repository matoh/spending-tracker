'use server';

import { kyselyConnection as db } from '@/database/Database';
import { ExpenseSchema, expenseSchema, BulkExpenseSchema, bulkExpenseSchema } from '@/lib/schemas/expenses';
import { convertCurrency } from '@/lib/services/exchange-rate';
import { ActionResponse, ActionStatus } from '@/types/action-response';
import { revalidatePath } from 'next/cache';
import { BASE_CURRENCY } from '../constants';

/**
 * Create expense from the form data
 * @param formData - The form data to create the expense from
 * @returns The action response
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

  const { input_amount, input_currency } = validatedFields.data;
  try {
    const conversion = await convertCurrency(input_amount, input_currency, BASE_CURRENCY);

    if (!conversion) {
      return {
        status: ActionStatus.ERROR,
        message: 'Failed to convert currency. Please try again later.'
      };
    }

    const expenseData = {
      ...validatedFields.data,
      base_currency: BASE_CURRENCY,
      base_amount: Math.round(conversion.convertedAmount * 100) / 100, // Round to 2 decimal places
      report_id: validatedFields.data.report_id || null
    };

    await db().insertInto('expenses').values(expenseData).returningAll().execute();
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
 * @param formData - The form data to update the expense from
 * @returns The action response
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

  const { input_amount, input_currency } = validatedFields.data;

  try {
    const conversion = await convertCurrency(input_amount, input_currency, BASE_CURRENCY);

    if (!conversion) {
      return {
        status: ActionStatus.ERROR,
        message: 'Failed to convert currency. Please try again later.'
      };
    }

    const expenseData = {
      ...validatedFields.data,
      base_currency: BASE_CURRENCY,
      base_amount: Math.round(conversion.convertedAmount * 100) / 100, // Round to 2 decimal places
      report_id: validatedFields.data.report_id || null
    };

    await db().updateTable('expenses').set(expenseData).where('id', '=', Number(expenseId)).returningAll().execute();
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
 * @param expenseId - The id of the expense to delete
 * @returns The action response
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

/**
 * Create multiple expenses from the form data
 * @param formData - The form data to create the expenses from
 * @returns The action response
 */
export async function createBulkExpenses(formData: BulkExpenseSchema): Promise<ActionResponse> {
  const validatedFields = bulkExpenseSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      status: ActionStatus.ERROR,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to create expenses.'
    };
  }

  const { expenses } = validatedFields.data;
  
  try {
    // Process all expenses and convert currencies
    const processedExpenses = await Promise.all(
      expenses.map(async (expense) => {
        const { input_amount, input_currency } = expense;
        const conversion = await convertCurrency(input_amount, input_currency, BASE_CURRENCY);

        if (!conversion) {
          throw new Error(`Failed to convert currency for expense: ${expense.merchant}`);
        }

        return {
          ...expense,
          base_currency: BASE_CURRENCY,
          base_amount: Math.round(conversion.convertedAmount * 100) / 100, // Round to 2 decimal places
          report_id: expense.report_id || null
        };
      })
    );

    // Insert all expenses in a single transaction
    await db().insertInto('expenses').values(processedExpenses).execute();
  } catch (error) {
    console.log('Database Error: Failed to create bulk expenses.', JSON.stringify(error));
    return {
      status: ActionStatus.ERROR,
      message: 'Failed to create expenses.'
    };
  }

  revalidatePath('/expenses');
  return {
    status: ActionStatus.SUCCESS,
    message: `Successfully created ${expenses.length} expenses`
  };
}
