'use server';

import { kyselyConnection as db } from '@/database/Database';
import { ReportSchema, reportSchema } from '@/lib/schemas/reports';
import { ActionResponse, ActionStatus } from '@/types/action-response';
import { revalidatePath } from 'next/cache';

/**
 * Create report from the form data
 * @param formData
 */
export async function createReport(formData: ReportSchema): Promise<ActionResponse> {
  const validatedFields = reportSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      status: ActionStatus.ERROR,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to create report.'
    };
  }

  try {
    await db().insertInto('reports').values(formData).returningAll().execute();
  } catch (error) {
    console.log('Database Error: Failed to create report.', JSON.stringify(error));
    return {
      status: ActionStatus.ERROR,
      message: 'Failed to create Report.'
    };
  }

  revalidatePath('/reports');
  return {
    status: ActionStatus.SUCCESS,
    message: 'Report was successfully created'
  };
}

/**
 * Update report from the form data
 * @param reportId
 * @param formData
 */
export async function updateReport(reportId: number, formData: ReportSchema): Promise<ActionResponse> {
  const validatedFields = reportSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      status: ActionStatus.ERROR,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to update report.'
    };
  }

  try {
    const updateResult = await db()
      .updateTable('reports')
      .set(formData)
      .where('id', '=', Number(reportId))
      .executeTakeFirst();

    revalidatePath('/reports');

    return Number(updateResult.numUpdatedRows) > 0
      ? {
          status: ActionStatus.SUCCESS,
          message: 'Successfully updated report'
        }
      : {
          status: ActionStatus.ERROR,
          message: 'Failed to update report.'
        };
  } catch (error) {
    console.log('Database Error: Failed to update report.', JSON.stringify(error));
    return {
      status: ActionStatus.ERROR,
      message: 'Failed to update report.'
    };
  }
}

/**
 * Delete report by report id
 * @param reportId
 */
export async function deleteReport(reportId: number): Promise<ActionResponse> {
  try {
    const deleteResult = await db().deleteFrom('reports').where('id', '=', Number(reportId)).executeTakeFirst();
    revalidatePath('/reports');

    return Number(deleteResult.numDeletedRows) > 0
      ? {
          status: ActionStatus.SUCCESS,
          message: 'Successfully deleted report'
        }
      : {
          status: ActionStatus.ERROR,
          message: 'Failed to delete report.'
        };
  } catch (error) {
    console.log('Database Error: Failed to delete report.', JSON.stringify(error));
    return {
      status: ActionStatus.ERROR,
      message: 'Failed to delete report.'
    };
  }
}
