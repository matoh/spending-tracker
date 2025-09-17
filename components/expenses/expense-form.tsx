import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExpenseSchema } from '@/lib/schemas/expenses';
import { ExpenseCategories } from '@/types/expense-categories';
import { ExpenseCurrencies } from '@/types/expense-currencies';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Selectable } from 'kysely';
import { Reports } from 'kysely-codegen/dist/db';

interface ExpenseFormProps {
  form: UseFormReturn<ExpenseSchema>;
  onSubmit: (expense: ExpenseSchema) => void;
  action: 'create' | 'edit';
  reports: Selectable<Reports>[];
}

export function ExpenseForm({ form, onSubmit, action, reports }: ExpenseFormProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='merchant'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Merchant</FormLabel>
              <FormControl>
                <Input placeholder='Merchant name' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* TODO: https://stackoverflow.com/questions/77810607/how-to-use-shadcn-ui-range-date-picker-inside-form*/}
        <FormField
          control={form.control}
          name='date'
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={undefined}>Date</FormLabel>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button variant='outline' className='w-full justify-start text-left font-normal'>
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {format(field.value, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0'>
                  <Calendar
                    mode='single'
                    selected={field.value}
                    onSelect={(selectedDate) => {
                      field.onChange(selectedDate);
                      setIsCalendarOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='input_amount'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total</FormLabel>
              <FormControl>
                <Input type='number' placeholder='Cost of expense' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='input_currency'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Currency</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Choose currency' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ExpenseCurrencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='category'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Choose category' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ExpenseCategories.map((expenseCategory) => (
                    <SelectItem key={expenseCategory} value={expenseCategory}>
                      {expenseCategory}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Input placeholder='Short description' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='report_id'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Report (Optional)</FormLabel>
              <Select onValueChange={(value) => field.onChange(value ? Number(value) : undefined)} value={field.value?.toString()}>
                <FormControl>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Choose report' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {reports.map((report) => (
                    <SelectItem key={report.id} value={report.id.toString()}>
                      {report.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit'>{action === 'create' ? 'Create' : 'Update'}</Button>
      </form>
    </Form>
  );
}
