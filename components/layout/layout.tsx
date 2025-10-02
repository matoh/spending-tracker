import { AccountDropdown } from '@/components/account/account-dropdown';
import { MobileSidebarSheet } from '@/components/layout/sidebar/mobile-sidebar-sheet';
import { Sidebar } from '@/components/layout/sidebar/sidebar';
import { ReactElement, ReactNode } from 'react';

export function PageTitle({ text }: { text: string }): ReactElement {
  return <h1 className='text-lg font-semibold md:text-2xl'>{text}</h1>;
}

export function Layout({ children }: { children: ReactNode }): ReactElement {
  return (
    <div className='grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]'>
      <Sidebar />
      <div className='flex flex-col'>
        <header className='flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6'>
          <MobileSidebarSheet />
          <AccountDropdown />
        </header>
        <main className='flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6'>{children}</main>
      </div>
    </div>
  );
}
