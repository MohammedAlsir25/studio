'use client';

import SummaryCards from '@/components/dashboard/summary-cards';
import SpendingChart from '@/components/dashboard/spending-chart';
import BudgetStatus from '@/components/dashboard/budget-status';
import RecentExpenses from '@/components/dashboard/recent-expenses';
import { useData } from '@/hooks/use-data';
import { Skeleton } from '@/components/ui/skeleton';
import WeeklySummary from '@/components/dashboard/weekly-summary';

export default function DashboardPage() {
  const { expenses, budgets, loading } = useData();

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-headline text-4xl font-black tracking-tighter">Dashboard</h1>
          <p className="text-muted-foreground">Your financial overview</p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Skeleton className="h-80 w-full" />
          </div>
          <div>
            <Skeleton className="h-80 w-full" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Skeleton className="h-96 w-full" />
          </div>
          <div>
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline text-4xl font-black tracking-tighter">Dashboard</h1>
        <p className="text-muted-foreground">A snapshot of your financial health.</p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCards expenses={expenses} />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SpendingChart expenses={expenses} />
        </div>
        <div>
          <BudgetStatus expenses={expenses} budgets={budgets} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentExpenses expenses={expenses.slice(0, 5)} />
        </div>
        <div>
          <WeeklySummary />
        </div>
      </div>
    </div>
  );
}
