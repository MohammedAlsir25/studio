'use client';

import ReportsView from "@/components/reports/reports-view";
import { useData } from "@/hooks/use-data";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReportsPage() {
  const { expenses, loading } = useData();

  return (
    <div className="flex flex-col gap-6">
       <div>
        <h1 className="font-headline text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">
          Generate expense reports for specific date ranges.
        </p>
      </div>
      {loading ? (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Skeleton className="h-10 w-[300px]" />
            <Skeleton className="h-24 w-full sm:w-48" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      ) : (
        <ReportsView allExpenses={expenses} />
      )}
    </div>
  );
}
