import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/app-core/providers/StoreProvider';
import { Header } from '@/widgets/header';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Digital Travel — News',
  description: 'Cross-platform news aggregator with search, favorites, and file management.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <StoreProvider>
          <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1">{children}</main>
            <footer className="border-t py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <p className="text-center text-sm text-muted-foreground">
                  Digital Travel &copy; {new Date().getFullYear()}. Built with Next.js, Shadcn, and RTK Query.
                </p>
              </div>
            </footer>
          </div>
          <Toaster />
        </StoreProvider>
      </body>
    </html>
  );
}
