'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createExpenseTest } from '@/lib/actions';
import { createExpenseSchema } from '@/lib/schemas/expenses';
import { expenseCategories } from '@/types/expense-categories';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Calendar } from '../ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';

export function CreateExpense() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const form = useForm<z.infer<typeof createExpenseSchema>>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: {
      merchant: '',
      date: new Date(),
      input_amount: 0,
      input_currency: 'SEK',
      category: 'Meals',
      description: ''
    }
  });

  async function onSubmit(expense: z.infer<typeof createExpenseSchema>) {
    const response = await createExpenseTest(expense);

    if (response.errors) {
      Object.keys(response.errors).forEach((fieldId) => {
        // @ts-ignore TODO: Fix typing
        form.setError(fieldId, { message: response.errors[fieldId][0] });
      });
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size='sm'>Create</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New expense</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
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
                  <FormLabel>Date</FormLabel>
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
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
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
                      {expenseCategories.map((expenseCategory) => (
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

            <Button type='submit'>Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
