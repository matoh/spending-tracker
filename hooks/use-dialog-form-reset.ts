import { useEffect } from 'react';
import { UseFormReturn, FieldValues } from 'react-hook-form';

interface UseDialogFormResetProps<T extends FieldValues> {
  openDialog: boolean;
  form: UseFormReturn<T>;
  resetValues: T;
}

export function useDialogOnCloseFormReset<T extends FieldValues>({ openDialog, form, resetValues }: UseDialogFormResetProps<T>) {
  useEffect(() => {
    if (!openDialog) {
      form.reset(resetValues);
    }
  }, [openDialog, form, resetValues]);
}
