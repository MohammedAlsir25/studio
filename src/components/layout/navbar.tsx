'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wallet, Plus, LayoutDashboard, ShoppingCart, BarChart, Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AddExpenseDialog } from '@/components/expenses/add-expense-dialog';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/expenses', label: 'Expenses', icon: ShoppingCart },
  { href: '/budgets', label: 'Budgets', icon: BarChart },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <Link href="/dashboard" className="flex items-center gap-2 font-headline text-lg font-bold tracking-wider text-primary">
        <Wallet />
        <span className="text-foreground">PennyPincher</span>
      </Link>
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "transition-colors hover:text-foreground",
              pathname === item.href ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="ml-auto flex items-center gap-4">
        <AddExpenseDialog>
            <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Expense
            </Button>
        </AddExpenseDialog>
        <Avatar className="h-9 w-9">
          <AvatarImage src="https://picsum.photos/seed/user/40/40" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
