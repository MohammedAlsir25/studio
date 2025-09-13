import { getBudgets } from '@/lib/actions';
import BudgetForm from '@/components/budgets/budget-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default async function BudgetsPage() {
  const budgets = await getBudgets();

  return (
    <div className="flex flex-col gap-6">
       <div>
        <h1 className="font-headline text-3xl font-bold">Budgets</h1>
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
            <BudgetForm budgets={budgets} />
        </CardContent>
      </Card>
    </div>
  );
}
