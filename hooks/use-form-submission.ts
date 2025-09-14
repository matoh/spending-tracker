import { useToast } from '@/hooks/use-toast';
import { ActionResponse } from '@/types/action-response';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { setFormErrors } from '@/lib/utils';

/**
 * Custom hook for handling form submission with common error handling and success logic
 * @param form - The react-hook-form instance
 * @param setOpenDialog - Function to close the dialog on success
 * @returns A function that handles form submission
 */
export function useFormSubmission<T extends FieldValues>(
  form: UseFormReturn<T>,
  setOpenDialog: (open: boolean) => void
) {
  const { toast } = useToast();

  const handleSubmission = (response: ActionResponse) => {
    if (response && response.errors) {
      setFormErrors(response.errors, form);
    } else {
      toast({ title: response.status, description: response.message });
      form.reset();
      setOpenDialog(false);
    }
  };

  return handleSubmission;
}
