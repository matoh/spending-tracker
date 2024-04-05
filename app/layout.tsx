import { Layout } from '@/components/layout/layout';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import { ReactNode } from 'react';
import './styles/globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | Spending Tracker',
    default: 'Spending Tracker'
  },
  description: 'Spending tracker for managing expenses with reports, graphs and statistics\n'
};

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
});

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    // Hydration issue: https://github.com/pacocoursey/next-themes/issues/169
    <html lang='en' suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
          <Layout>{children}</Layout>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
