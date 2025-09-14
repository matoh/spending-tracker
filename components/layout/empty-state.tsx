import { Icon } from '@/components/layout/icon';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <Card className='mt-10'>
      <CardContent className='flex flex-col items-center justify-center py-16 px-8'>
        <div className='w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4'>
          <Icon classNames={['h-8', 'w-8']} lucidMenuIcon={icon || FileText} />
        </div>
        <h3 className='text-lg font-semibold text-foreground mb-2'>{title}</h3>
        <p className='text-muted-foreground text-center mb-6 max-w-sm'>{description}</p>
        {action}
      </CardContent>
    </Card>
  );
}
