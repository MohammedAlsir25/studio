'use client';

import dynamic from 'next/dynamic';
import SummaryCards from '@/components/dashboard/summary-cards';
import BudgetStatus from '@/components/dashboard/budget-status';
import RecentExpenses from '@/components/dashboard/recent-expenses';
import { useData } from '@/hooks/use-data';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Dynamically import the SpendingChart with a custom loading component
const SpendingChart = dynamic(() => import('@/components/dashboard/spending-chart'), {
  loading: () => (
    <Card>
      <CardHeader>
        <CardTitle>Spending Overview</CardTitle>
      </CardHeader>
      <CardContent>
         <div className="flex h-[300px] items-center justify-center">
            <Skeleton className="h-full w-full" />
        </div>
      </CardContent>
    </Card>
  ),
  ssr: false, // This chart is client-side only
});


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
        <div className="lg:col-span-2">
          <Skeleton className="h-96 w-full" />
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
       <div className="lg:col-span-2">
          <RecentExpenses expenses={expenses.slice(0, 10)} />
        </div>
    </div>
  );
}
