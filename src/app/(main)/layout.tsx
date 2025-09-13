
'use client';

import type { ReactNode } from 'react';
import { AuthProvider, useAuth } from '@/hooks/use-auth';
import { DataProvider } from '@/hooks/use-data';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Navbar } from '@/components/layout/navbar';

function MainLayoutContent({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="text-2xl font-bold tracking-wider text-primary">Loading WalletWise...</div>
      </div>
    );
  }

  return (
    <DataProvider>
      <div className="flex min-h-screen w-full flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          {children}
        </main>
      </div>
    </DataProvider>
  );
}

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <MainLayoutContent>{children}</MainLayoutContent>
    </AuthProvider>
  );
}
