import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BulkExpenseSchema } from '@/lib/schemas/expenses';
import { ExpenseCategories } from '@/types/expense-categories';
import { ExpenseCurrencies } from '@/types/expense-currencies';
import { BASE_CURRENCY } from '@/lib/constants';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Selectable } from 'kysely';
import { Reports } from 'kysely-codegen/dist/db';

interface BulkExpenseFormProps {
  form: UseFormReturn<BulkExpenseSchema>;
  onSubmit: (expenses: BulkExpenseSchema) => void;
  reports: Selectable<Reports>[];
}

export function BulkExpenseForm({ form, onSubmit, reports }: BulkExpenseFormProps) {
  const [openCalendars, setOpenCalendars] = useState<{ [key: number]: boolean }>({});
  const [selectedReportId, setSelectedReportId] = useState<number | undefined>(undefined);

  const toggleCalendar = (index: number) => {
    setOpenCalendars(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const addExpense = () => {
    const currentExpenses = form.getValues('expenses');
    if (currentExpenses.length < 10) {
      form.setValue('expenses', [
        ...currentExpenses,
        {
          merchant: '',
          date: new Date(),
          input_amount: 0,
          input_currency: BASE_CURRENCY,
          base_amount: 0,
          base_currency: BASE_CURRENCY,
          category: '' as (typeof ExpenseCategories)[number],
          description: '',
          report_id: selectedReportId
        }
      ]);
    }
  };

  const removeExpense = (index: number) => {
    const currentExpenses = form.getValues('expenses');
    if (currentExpenses.length > 1) {
      const newExpenses = currentExpenses.filter((_, i) => i !== index);
      form.setValue('expenses', newExpenses);
    }
  };

  const expenses = form.watch('expenses');

  const handleSubmit = (data: BulkExpenseSchema) => {
    const expensesWithReport = data.expenses.map(expense => ({
      ...expense,
      report_id: selectedReportId
    }));
    onSubmit({ ...data, expenses: expensesWithReport });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-3'>
        <div className='border rounded-md p-3 space-y-2'>
          <h3 className='text-sm font-medium'>Report (Optional)</h3>
          <div className='space-y-1'>
            <label className='text-xs'>Select Report</label>
            <Select onValueChange={(value) => setSelectedReportId(value ? Number(value) : undefined)} value={selectedReportId?.toString()}>
              <SelectTrigger className='w-full h-8 text-sm'>
                <SelectValue placeholder='Choose report' />
              </SelectTrigger>
              <SelectContent>
                {reports.map((report) => (
                  <SelectItem key={report.id} value={report.id.toString()} className='text-sm'>
                    {report.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className='space-y-2'>
          {expenses.map((_, index) => (
            <div key={index} className='border rounded-md p-3 space-y-2'>
              <div className='flex items-center justify-between'>
                <h3 className='text-xs font-medium text-muted-foreground'>#{index + 1}</h3>
                {expenses.length > 1 && (
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={() => removeExpense(index)}
                    className='h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50'
                  >
                    <Trash2 className='h-3 w-3' />
                  </Button>
                )}
              </div>

              <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2'>
                <FormField
                  control={form.control}
                  name={`expenses.${index}.merchant`}
                  render={({ field }) => (
                    <FormItem className='space-y-1 col-span-1'>
                      <FormLabel className='text-xs'>Merchant</FormLabel>
                      <FormControl>
                        <Input placeholder='Merchant' className='h-8 text-sm' {...field} />
                      </FormControl>
                      <FormMessage className='text-xs' />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`expenses.${index}.date`}
                  render={({ field }) => (
                    <FormItem className='space-y-1 col-span-1'>
                      <FormLabel className='text-xs'>Date</FormLabel>
                      <Popover open={openCalendars[index]} onOpenChange={() => toggleCalendar(index)}>
                        <PopoverTrigger asChild>
                          <Button variant='outline' className='w-full h-8 justify-start text-left font-normal text-sm'>
                            <CalendarIcon className='mr-1 h-3 w-3' />
                            {format(field.value, 'MMM dd')}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0'>
                          <Calendar
                            mode='single'
                            selected={field.value}
                            onSelect={(selectedDate) => {
                              field.onChange(selectedDate);
                              toggleCalendar(index);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage className='text-xs' />
                    </FormItem>
                  )}
                />

                <div className='col-span-1 flex gap-1'>
                  <FormField
                    control={form.control}
                    name={`expenses.${index}.input_amount`}
                    render={({ field }) => (
                      <FormItem className='space-y-1 flex-1'>
                        <FormLabel className='text-xs'>Amount</FormLabel>
                        <FormControl>
                          <Input type='number' placeholder='0.00' className='h-8 text-sm' {...field} />
                        </FormControl>
                        <FormMessage className='text-xs' />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`expenses.${index}.input_currency`}
                    render={({ field }) => (
                      <FormItem className='space-y-1 w-20'>
                        <FormLabel className='text-xs'>Currency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className='w-full h-8 text-sm'>
                              <SelectValue placeholder='USD' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ExpenseCurrencies.map((currency) => (
                              <SelectItem key={currency} value={currency} className='text-sm'>
                                {currency}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className='text-xs' />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={`expenses.${index}.category`}
                  render={({ field }) => (
                    <FormItem className='space-y-1 col-span-1'>
                      <FormLabel className='text-xs'>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className='w-full h-8 text-sm'>
                            <SelectValue placeholder='Category' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ExpenseCategories.map((expenseCategory) => (
                            <SelectItem key={expenseCategory} value={expenseCategory} className='text-sm'>
                              {expenseCategory}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className='text-xs' />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`expenses.${index}.description`}
                  render={({ field }) => (
                    <FormItem className='space-y-1 col-span-1'>
                      <FormLabel className='text-xs'>Description</FormLabel>
                      <FormControl>
                        <Input placeholder='Description' className='h-8 text-sm' {...field} />
                      </FormControl>
                      <FormMessage className='text-xs' />
                    </FormItem>
                  )}
                />

              </div>
            </div>
          ))}
        </div>

        {expenses.length < 10 && (
          <Button
            type='button'
            variant='outline'
            onClick={addExpense}
            className='w-full h-8 text-sm'
          >
            <Plus className='mr-1 h-3 w-3' />
            Add Expense ({expenses.length}/10)
          </Button>
        )}

        <div className='flex gap-2'>
          <Button type='submit' className='flex-1 h-8 text-sm'>
            Create {expenses.length} Expense{expenses.length !== 1 ? 's' : ''}
          </Button>
        </div>
      </form>
    </Form>
  );
}
