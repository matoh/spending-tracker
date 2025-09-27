import { clsx, type ClassValue } from 'clsx';
import { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes without conflict and
 * support object syntax conditional class names
 * @param inputs
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Set form errors on the field inputs
 * @param errors
 * @param form
 */
export function setFormErrors<S extends FieldValues>(errors: Record<string, string[]>, form: UseFormReturn<S>) {
  Object.keys(errors).forEach((errorFieldId) => {
    const fieldId = errorFieldId as FieldPath<S>;

    if (errors[fieldId] && errors[fieldId].length > 0) {
      form.setError(fieldId, { message: errors[fieldId][0] });
    }
  });
}

/**
 * Calculates linear regression for a dataset
 * @param data Array of numbers to calculate trend for
 * @returns Object with slope, intercept, and trend values
 */
export function calculateLinearRegression(data: number[]) {
  if (data.length < 2) {
    return { slope: 0, intercept: data[0] || 0, trendValues: data };
  }

  const n = data.length;
  const sumX = (n * (n - 1)) / 2; // Sum of indices 0, 1, 2, ..., n-1
  const sumY = data.reduce((sum, value) => sum + value, 0);
  const sumXY = data.reduce((sum, value, index) => sum + index * value, 0);
  const sumXX = (n * (n - 1) * (2 * n - 1)) / 6; // Sum of squares of indices

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const trendValues = data.map((_, index) => slope * index + intercept);

  return { slope, intercept, trendValues };
}
