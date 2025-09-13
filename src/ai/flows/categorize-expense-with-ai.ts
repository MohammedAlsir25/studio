'use server';
/**
 * @fileOverview This file contains a Genkit flow for categorizing expenses using AI.
 *
 * The flow takes an expense description as input and returns a suggested category.
 *
 * @file ExpenseCategorizationFlow - The main Genkit flow for expense categorization.
 * @file CategorizeExpenseInput - The input type for the ExpenseCategorizationFlow.
 * @file CategorizeExpenseOutput - The output type for the ExpenseCategorizationFlow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeExpenseInputSchema = z.object({
  description: z
    .string()
    .describe('The description of the expense, e.g., \'coffee at Starbucks\'.'),
});
export type CategorizeExpenseInput = z.infer<typeof CategorizeExpenseInputSchema>;

const CategorizeExpenseOutputSchema = z.object({
  category: z
    .string()
    .describe(
      'The predicted category of the expense.  For example: Food, Transport, Entertainment, Groceries, Utilities, Rent, etc.'
    ),
});
export type CategorizeExpenseOutput = z.infer<typeof CategorizeExpenseOutputSchema>;

export async function categorizeExpenseWithAI(input: CategorizeExpenseInput): Promise<CategorizeExpenseOutput> {
  return categorizeExpenseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeExpensePrompt',
  input: {schema: CategorizeExpenseInputSchema},
  output: {schema: CategorizeExpenseOutputSchema},
  prompt: `You are an AI assistant that helps users categorize their expenses.

  Given the following expense description, suggest the most appropriate category.

  Description: {{{description}}}

  Respond with just the category name.
  `,
});

const categorizeExpenseFlow = ai.defineFlow(
  {
    name: 'categorizeExpenseFlow',
    inputSchema: CategorizeExpenseInputSchema,
    outputSchema: CategorizeExpenseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
