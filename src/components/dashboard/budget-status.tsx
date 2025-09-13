import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";
import type { Expense, Budget, Category } from "@/lib/types";

export default function BudgetStatus({ expenses, budgets }: { expenses: Expense[], budgets: Budget[] }) {
  const spendingByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<Category, number>);

  const budgetStatus = budgets.map(budget => {
    const spent = spendingByCategory[budget.category] || 0;
    const progress = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
    return { ...budget, spent, progress };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Status</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {budgetStatus.length > 0 ? budgetStatus.map(item => (
          <div key={item.category} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{item.category}</span>
              <span className="text-muted-foreground">
                {formatCurrency(item.spent)} / {formatCurrency(item.amount)}
              </span>
            </div>
            <Progress value={item.progress} />
          </div>
        )) : <p className="text-muted-foreground">No budgets set.</p>}
      </CardContent>
    </Card>
  );
}
