import { cn } from '@/lib/utils';
import { ClassArray } from 'clsx';
import { LucideIcon } from 'lucide-react';
import { ReactElement } from 'react';

export interface IconProps {
  lucidMenuIcon: LucideIcon;
  classNames?: ClassArray;
}

/**
 * Configurable icon from lucide react
 * @param lucidMenuIcon
 * @param classNames
 */
export function Icon({ lucidMenuIcon, classNames = ['h-4', 'w-4'] }: IconProps): ReactElement {
  const LucidMenuIconComponent = lucidMenuIcon;

  return <LucidMenuIconComponent className={cn(classNames)} />;
}
