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
