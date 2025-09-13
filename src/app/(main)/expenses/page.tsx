'use client';

import { useState, useMemo } from 'react';
import { DateRange } from 'react-day-picker';
import { addDays, format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import ExpensesDataTable from '@/components/expenses/data-table';
import { columns } from '@/components/expenses/columns';
import { useData } from '@/hooks/use-data';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn, formatCurrency } from '@/lib/utils';
import type { Expense } from '@/lib/types';

export default function ExpensesPage() {
  const { expenses, loading } = useData();

  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  const filteredExpenses = useMemo(() => {
    if (loading || !date?.from) return [];
    const fromDate = date.from;
    const toDate = date.to ?? fromDate; // If no 'to' date, use 'from' date
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= fromDate && expenseDate <= toDate;
    });
  }, [expenses, date, loading]);
  
  const total = useMemo(() => {
    return filteredExpenses.reduce((acc, expense) => acc + expense.amount, 0);
  }, [filteredExpenses]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline text-4xl font-black tracking-tighter">Expenses</h1>
        <p className="text-muted-foreground">
          View and manage all your transactions in one place.
        </p>
      </div>

      {loading ? (
        <ExpensesSkeleton />
      ) : (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                        "w-[300px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                        date.to ? (
                            <>
                            {format(date.from, "LLL dd, y")} -{" "}
                            {format(date.to, "LLL dd, y")}
                            </>
                        ) : (
                            format(date.from, "LLL dd, y")
                        )
                        ) : (
                        <span>Pick a date</span>
                        )}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                    />
                    </PopoverContent>
                </Popover>
                <Card className="w-full sm:w-auto">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total for Period</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(total)}</div>
                    </CardContent>
                </Card>
            </div>
            <ExpensesDataTable columns={columns} data={filteredExpenses} />
        </div>
      )}
    </div>
  );
}


function ExpensesSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Skeleton className="h-10 w-[300px]" />
                <Skeleton className="h-24 w-full sm:w-48" />
            </div>
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
    );
}
