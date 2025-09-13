'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useData } from '@/hooks/use-data';
import { getWeeklySummary } from '@/lib/actions';
import { Loader2, Sparkles } from 'lucide-react';
import { addDays } from 'date-fns';

export default function WeeklySummary() {
  const [isPending, startTransition] = useTransition();
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { expenses } = useData();

  const handleGenerateSummary = () => {
    startTransition(async () => {
      setError(null);
      setSummary(null);

      const oneWeekAgo = addDays(new Date(), -7);
      const recentExpenses = expenses.filter(e => new Date(e.date) >= oneWeekAgo);

      if (recentExpenses.length === 0) {
        setSummary("No expenses in the last 7 days to analyze.");
        return;
      }

      try {
        const result = await getWeeklySummary(recentExpenses);
        setSummary(result.summary);
      } catch (err) {
        setError("Sorry, I couldn't generate the summary. Please try again.");
      }
    });
  };

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="text-primary" />
          <span>Weekly AI Summary</span>
        </CardTitle>
        <CardDescription>Get AI-powered insights on your spending over the last 7 days.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-4">
        <div className="flex-1 space-y-2">
          {isPending ? (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Analyzing your spending...</span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {error ? <span className="text-destructive">{error}</span> : summary || 'Click the button to generate your weekly spending analysis.'}
            </p>
          )}
        </div>
        <Button onClick={handleGenerateSummary} disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Summary'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
