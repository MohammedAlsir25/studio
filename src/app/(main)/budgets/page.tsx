'use client';

import BudgetForm from '@/components/budgets/budget-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useData } from '@/hooks/use-data';
import { Skeleton } from '@/components/ui/skeleton';

export default function BudgetsPage() {
  const { budgets, loading } = useData();

  return (
    <div className="flex flex-col gap-6">
       <div>
        <h1 className="font-headline text-4xl font-black tracking-tighter">Budgets</h1>
        <p className="text-muted-foreground">
          Create and manage your monthly budgets for each category.
        </p>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Category Budgets</CardTitle>
            <CardDescription>Set a monthly spending limit for each category to stay on track.</CardDescription>
        </CardHeader>
        <CardContent>
            {loading ? <BudgetFormSkeleton /> : <BudgetForm budgets={budgets} />}
        </CardContent>
      </Card>
    </div>
  );
}

function BudgetFormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}
