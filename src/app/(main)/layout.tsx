'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart, LayoutDashboard, Wallet, Plus, Settings, ShoppingCart } from 'lucide-react';
import type { ReactNode } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AddExpenseDialog } from '@/components/expenses/add-expense-dialog';
import { DataProvider } from '@/hooks/use-data';
import { AuthProvider, useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/expenses', label: 'Expenses', icon: ShoppingCart },
  { href: '/budgets', label: 'Budgets', icon: BarChart },
  { href: '/settings', label: 'Settings', icon: Settings },
];

function MainLayoutContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
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
        <div className="text-2xl font-bold tracking-wider text-primary">Loading PennyPincher...</div>
      </div>
    );
  }

  return (
    <DataProvider>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 p-2 font-headline text-lg font-bold tracking-wider text-primary">
              <Wallet />
              <span className="text-foreground">PennyPincher</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href} asChild>
                    <SidebarMenuButton
                      isActive={pathname === item.href}
                      tooltip={item.label}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <div className="flex items-center gap-2 p-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://picsum.photos/seed/user/40/40" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-sm">
                  <span className="font-semibold text-foreground">{user.name}</span>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
            <SidebarTrigger />
            <AddExpenseDialog>
              <button className="inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-3 text-sm font-bold text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                <Plus className="h-4 w-4" />
                <span>Add Expense</span>
              </button>
            </AddExpenseDialog>
          </header>
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
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
