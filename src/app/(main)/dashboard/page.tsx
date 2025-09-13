import { getExpenses, getBudgets } from '@/lib/actions';
import SummaryCards from '@/components/dashboard/summary-cards';
import SpendingChart from '@/components/dashboard/spending-chart';
import BudgetStatus from '@/components/dashboard/budget-status';
import RecentExpenses from '@/components/dashboard/recent-expenses';

export default async function DashboardPage() {
  const expenses = await getExpenses();
  const budgets = await getBudgets();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-headline text-3xl font-bold">Dashboard</h1>
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
      <div>
        <RecentExpenses expenses={expenses.slice(0, 5)} />
      </div>
    </div>
  );
}
