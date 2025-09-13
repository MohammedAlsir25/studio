"use client"

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { categories, type Budget } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useData } from "@/hooks/use-data";

type FormValues = Record<string, number>;

export default function BudgetForm({ budgets }: { budgets: Budget[] }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { updateBudgets } = useData();

  const defaultValues = categories.reduce((acc, category) => {
    const existingBudget = budgets.find(b => b.category === category);
    acc[category] = existingBudget ? existingBudget.amount : 0;
    return acc;
  }, {} as FormValues);

  const form = useForm<FormValues>({ defaultValues });

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      try {
        const newBudgets: Budget[] = categories.map(category => ({
          category,
          amount: values[category] || 0
        }));
        await updateBudgets(newBudgets);
        toast({ title: "Budgets Updated", description: "Your budgets have been saved." });
      } catch (error) {
        toast({ variant: 'destructive', title: "Error", description: "Failed to update budgets." });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <FormField
              key={category}
              control={form.control}
              name={category}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{category}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                      <Input
                        type="number"
                        placeholder="0.00"
                        className="pl-7"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          ))}
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Budgets
          </Button>
        </div>
      </form>
    </Form>
  );
}
