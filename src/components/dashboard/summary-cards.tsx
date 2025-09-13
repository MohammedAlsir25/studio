import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { Expense } from "@/lib/types";
import { DollarSign, ReceiptText, TrendingUp, PiggyBank } from "lucide-react";

export default function SummaryCards({ expenses }: { expenses: Expense[] }) {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const averageTransaction = expenses.length > 0 ? totalExpenses / expenses.length : 0;
  const totalTransactions = expenses.length;
  
  const highestSpending = expenses.reduce((max, expense) => expense.amount > max ? expense.amount : max, 0);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Spending</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
          <p className="text-xs text-muted-foreground">in {totalTransactions} transactions</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Transaction</CardTitle>
          <ReceiptText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(averageTransaction)}</div>
           <p className="text-xs text-muted-foreground">across all transactions</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Highest Spending</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(highestSpending)}</div>
           <p className="text-xs text-muted-foreground">in a single transaction</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Goal</CardTitle>
          <PiggyBank className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-muted-foreground/50">Not Set</div>
           <p className="text-xs text-muted-foreground">Go to budgets to set goals</p>
        </CardContent>
      </Card>
    </>
  );
}
