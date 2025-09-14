import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ReportSchema } from '@/lib/schemas/reports';
import { ExpenseCurrencies } from '@/types/expense-currencies';
import { UseFormReturn } from 'react-hook-form';

interface ReportFormProps {
  form: UseFormReturn<ReportSchema>;
  onSubmit: (report: ReportSchema) => void;
  action: 'create' | 'edit';
}

export function ReportForm({ form, onSubmit, action }: ReportFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Report Name</FormLabel>
              <FormControl>
                <Input placeholder='Report name' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit'>{action === 'create' ? 'Create' : 'Update'}</Button>
      </form>
    </Form>
  );
}
