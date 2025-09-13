
'use client'

import { RadialBarChart, RadialBar, Legend, Tooltip, ResponsiveContainer, LegendProps } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import type { Expense, Category } from "@/lib/types";
import { useMemo } from 'react';

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(20, 80%, 55%)",
  "hsl(150, 70%, 45%)",
];

const CustomLegend = ({ payload }: LegendProps) => {
  if (!payload) return null;

  return (
    <ul className="flex flex-col gap-2">
      {payload.map((entry, index) => {
        const { color, value } = entry;
        return (
          <li key={`item-${index}`} className="flex items-center gap-2 text-sm">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-muted-foreground">{value}</span>
          </li>
        );
      })}
    </ul>
  );
};


export default function SpendingChart({ expenses }: { expenses: Expense[] }) {
  const chartData = useMemo(() => {
    const spendingByCategory = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<Category, number>);

    return Object.entries(spendingByCategory)
      .map(([name, value], index) => ({
        name,
        value,
        fill: CHART_COLORS[index % CHART_COLORS.length],
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
                 <Legend
                  iconSize={10}
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  content={<CustomLegend />}
                  wrapperStyle={{ right: -20, top: '50%', transform: 'translateY(-50%)' }}
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
