import { MobileSidebarSheet } from '@/components/layout/sidebar/mobile-sidebar-sheet';
import { Sidebar } from '@/components/layout/sidebar/sidebar';
import { Button } from '@/components/ui/button';
import { AccountDropdown } from '@/components/account-dropdown';

export function Dashboard() {
  return (
    <div className='grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]'>
      <Sidebar />
      <div className='flex flex-col'>
        <header className='flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6'>
          <MobileSidebarSheet />
          <AccountDropdown />
        </header>
        <main className='flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6'>
          <div className='flex items-center'>
            <h1 className='text-lg font-semibold md:text-2xl'>Dashboard</h1>
          </div>
          <div className='flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm'>
            <div className='flex flex-col items-center gap-1 text-center'>
              <h3 className='text-2xl font-bold tracking-tight'>You have no products</h3>
              <p className='text-sm text-muted-foreground'>You can start selling as soon as you add a product.</p>
              <Button className='mt-4'>Add Product</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
