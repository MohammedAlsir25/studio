import { getExpenses } from '@/lib/actions';
import ExpensesDataTable from '@/components/expenses/data-table';
import { columns } from '@/components/expenses/columns';

export default async function ExpensesPage() {
  const data = await getExpenses();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Expenses</h1>
        <p className="text-muted-foreground">
          View and manage all your expenses.
        </p>
      </div>
      <ExpensesDataTable columns={columns} data={data} />
    </div>
  );
}
