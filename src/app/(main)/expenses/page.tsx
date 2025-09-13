'use client';

import ExpensesDataTable from '@/components/expenses/data-table';
import { columns } from '@/components/expenses/columns';
import { useData } from '@/hooks/use-data';
import { Skeleton } from '@/components/ui/skeleton';

export default function ExpensesPage() {
  const { expenses, loading } = useData();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Expenses</h1>
        <p className="text-muted-foreground">
          View and manage all your expenses.
        </p>
      </div>
      {loading ? (
        <div className="space-y-4">
          <div className="flex items-center">
            <Skeleton className="h-10 w-64" />
          </div>
          <div className="rounded-md border">
            <div className="h-96" />
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
      ) : (
        <ExpensesDataTable columns={columns} data={expenses} />
      )}
    </div>
  );
}
