
'use client'

import { RadialBarChart, RadialBar, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import type { Expense, Category } from "@/lib/types";
import { useMemo } from 'react';
import { CATEGORY_COLORS } from '@/lib/colors';

export default function SpendingChart({ expenses }: { expenses: Expense[] }) {
  const chartData = useMemo(() => {
    const spendingByCategory = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<Category, number>);

    return Object.entries(spendingByCategory)
      .map(([name, value]) => ({
        name,
        value,
        fill: CATEGORY_COLORS[name] || "hsl(var(--primary))",
      }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  const chartConfig = useMemo(() => {
    return chartData.reduce((acc, data) => {
      acc[data.name] = {
        label: data.name,
        color: data.fill,
      };
      return acc;
    }, {} as any);
  }, [chartData]);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Overview</CardTitle>
      </CardHeader>
      <CardContent>
        {expenses.length > 0 ? (
          <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
            <ResponsiveContainer width="100%" height={300}>
              <RadialBarChart 
                data={chartData} 
                innerRadius="20%" 
                outerRadius="105%" 
                startAngle={90}
                endAngle={-270}
              >
                <Tooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel nameKey="name" />}
                />
                <RadialBar 
                  background 
                  dataKey='value'
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            No spending data to display.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
