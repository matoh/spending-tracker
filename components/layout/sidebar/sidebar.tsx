import { Icon } from '@/components/layout/icon';
import { Button } from '@/components/ui/button';
import { Bell, CircleDollarSign, Home, LucideIcon, Package, ShoppingCart, Users } from 'lucide-react';
import Link from 'next/link';
import { ReactElement } from 'react';

export const sidebarMenuItems: { name: string; path: string; icon: LucideIcon }[] = [
  {
    name: 'Dashboard',
    path: '/',
    icon: Home
  },
  {
    name: 'Expenses',
    path: 'expenses',
    icon: ShoppingCart
  },
  {
    name: 'Reports',
    path: 'reports',
    icon: Package
  },
  {
    name: 'Settings',
    path: 'settings',
    icon: Users
  }
];

export function Sidebar(): ReactElement {
  return (
    <div className='hidden border-r bg-muted/40 md:block'>
      <div className='flex h-full max-h-screen flex-col gap-2'>
        <div className='flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6'>
          <Link href='/' className='flex items-center gap-2 font-semibold'>
            <CircleDollarSign className='h-6 w-6' />
            <span className=''>Spending Tracker</span>
          </Link>
          <Button variant='outline' size='icon' className='ml-auto h-8 w-8'>
            <Bell className='h-4 w-4' />
            <span className='sr-only'>Toggle notifications</span>
          </Button>
        </div>
        <div className='flex-1'>
          <nav className='grid items-start px-2 text-sm font-medium lg:px-4'>
            {sidebarMenuItems.map((menuItem) => (
              <Link
                key={menuItem.path}
                href={menuItem.path}
                className='flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary'
              >
                <Icon lucidMenuIcon={menuItem.icon} />
                {menuItem.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
