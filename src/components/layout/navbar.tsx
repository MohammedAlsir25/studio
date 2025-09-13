
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wallet, Plus, LayoutDashboard, ShoppingCart, BarChart, Settings, Menu } from 'lucide-react';
import { AddExpenseDialog } from '@/components/expenses/add-expense-dialog';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/expenses', label: 'Expenses', icon: ShoppingCart },
  { href: '/budgets', label: 'Budgets', icon: BarChart },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <nav className="hidden w-full flex-col items-center gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <div className="mr-6 flex items-center">
            <Link href="/dashboard" className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 font-headline text-lg font-bold tracking-wider text-primary">
                <Wallet />
                <span className="text-foreground">WalletWise</span>
            </Link>
        </div>
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 transition-colors hover:text-foreground",
              pathname === item.href ? "text-foreground" : "text-muted-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
             <Link href="/dashboard" className="flex items-center gap-2 font-headline text-lg font-bold tracking-wider text-primary">
                <Wallet />
                <span className="text-foreground">WalletWise</span>
            </Link>
            {menuItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "flex items-center gap-4 transition-colors hover:text-foreground",
                        pathname === item.href ? "text-foreground" : "text-muted-foreground"
                    )}
                >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="ml-auto flex items-center gap-4">
        <AddExpenseDialog>
            <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Expense
            </Button>
        </AddExpenseDialog>
      </div>
    </header>
  );
}
