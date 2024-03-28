import { Icon } from '@/components/layout/icon';
import { sidebarMenuItems } from '@/components/layout/sidebar/sidebar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { ReactElement } from 'react';

export function MobileSidebarSheet(): ReactElement {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='outline' size='icon' className='shrink-0 md:hidden'>
          <Menu className='h-5 w-5' />
          <span className='sr-only'>Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side='left' className='flex flex-col'>
        <nav className='grid gap-2 text-lg font-medium'>
          {sidebarMenuItems.map((menuItem) => (
            <Link
              key={menuItem.path}
              href='#'
              className='mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground'
            >
              <Icon lucidMenuIcon={menuItem.icon} classNames={['h-5', 'w-5']} />
              {menuItem.name}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
