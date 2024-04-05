'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { deleteExpense } from '@/lib/actions/expenses';
import { Trash2 } from 'lucide-react';

export function DeleteExpenseDialog({ expenseId }: { expenseId: number }) {
  const { toast } = useToast();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant='ghost' size='sm'>
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone. This will permanently delete your expense.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              const response = await deleteExpense(expenseId);
              toast({ title: response.status, description: response.message });
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
