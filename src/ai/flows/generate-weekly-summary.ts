'use server';
/**
 * @fileOverview This file contains a Genkit flow for generating a weekly expense summary.
 *
 * The flow analyzes a user's expenses over the last 7 days and provides an insightful summary.
 */

import { ai } from '@/ai/genkit';
import type { Expense } from '@/lib/types';
import { z } from 'genkit';

const WeeklySummaryInputSchema = z.object({
  expenses: z.array(
    z.object({
      description: z.string(),
      amount: z.number(),
      category: z.string(),
      date: z.string(),
    })
  ).describe("A list of the user's expenses from the last 7 days."),
});
export type WeeklySummaryInput = z.infer<typeof WeeklySummaryInputSchema>;

const WeeklySummaryOutputSchema = z.object({
  summary: z.string().describe('A concise, insightful summary of the user\'s spending habits for the week. It should be friendly and encouraging.'),
});
export type WeeklySummaryOutput = z.infer<typeof WeeklySummaryOutputSchema>;

export async function generateWeeklySummary(input: WeeklySummaryInput): Promise<WeeklySummaryOutput> {
  return weeklySummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWeeklySummaryPrompt',
  input: { schema: WeeklySummaryInputSchema },
  output: { schema: WeeklySummaryOutputSchema },
  prompt: `You are a friendly and insightful financial assistant called Penny.

  Your goal is to provide a brief, helpful summary of the user's spending for the past week.
  
  Analyze the following list of expenses.
  
  - Identify the top spending category.
  - Calculate the total amount spent.
  - Offer a short, encouraging insight or observation about their spending.
  - Keep the summary to 2-3 short sentences.
  
  Here are the expenses:
  {{#each expenses}}
  - {{description}} ({{category}}): \${{amount}} on {{date}}
  {{/each}}
  `,
});

const weeklySummaryFlow = ai.defineFlow(
  {
    name: 'weeklySummaryFlow',
    inputSchema: WeeklySummaryInputSchema,
    outputSchema: WeeklySummaryOutputSchema,
  },
  async (input) => {
    // Convert date strings to Date objects for more robust processing if needed,
    // but for the prompt, string representation is fine.
    const preparedInput = {
        ...input,
        expenses: input.expenses.map(e => ({...e, date: new Date(e.date).toLocaleDateString()}))
    }
    const { output } = await prompt(preparedInput);
    return output!;
  }
);
