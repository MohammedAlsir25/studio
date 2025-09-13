import { getExpenses } from "@/lib/actions";
import ReportsView from "@/components/reports/reports-view";

export default async function ReportsPage() {
  const expenses = await getExpenses();

  return (
    <div className="flex flex-col gap-6">
       <div>
        <h1 className="font-headline text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">
          Generate expense reports for specific date ranges.
        </p>
      </div>
      <ReportsView allExpenses={expenses} />
    </div>
  );
}
