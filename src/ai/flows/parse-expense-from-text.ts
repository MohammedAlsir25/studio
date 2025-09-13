'use server';
/**
 * @fileOverview This file contains a Genkit flow for parsing an expense from a single line of text.
 *
 * The flow takes a natural language string and extracts the description, amount, and category.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { categories, type Category } from '@/lib/types';


const ParseExpenseInputSchema = z.object({
  text: z
    .string()
    .describe('The natural language text describing the expense. e.g., "Dinner with friends for $50"'),
});
export type ParseExpenseInput = z.infer<typeof ParseExpenseInputSchema>;

const ParseExpenseOutputSchema = z.object({
  description: z.string().describe('The detailed description of the expense.'),
  amount: z.number().describe('The numerical amount of the expense.'),
  category: z
    .string()
    .describe(
      `The predicted category of the expense. Must be one of the following: ${categories.join(', ')}.`
    ),
});
export type ParseExpenseOutput = z.infer<typeof ParseExpenseOutputSchema>;


export async function parseExpenseFromText(input: ParseExpenseInput): Promise<ParseExpenseOutput> {
  return parseExpenseFlow(input);
}


const prompt = ai.definePrompt({
  name: 'parseExpensePrompt',
  input: {schema: ParseExpenseInputSchema},
  output: {schema: ParseExpenseOutputSchema},
  prompt: `You are an AI assistant that helps users parse their expenses from a single line of text.

  Given the following text, extract the description, amount, and category.

  - The category MUST be one of the following: ${categories.join(', ')}.
  - If the user doesn't specify a category, infer the most likely one.
  - The description should be a clean, concise summary of the event. Do not include the amount or category in the description.
  - The current date is ${new Date().toDateString()}. Use this for context if the user uses relative dates like "yesterday" or "today".

  Text: {{{text}}}
  `,
});

const parseExpenseFlow = ai.defineFlow(
  {
    name: 'parseExpenseFlow',
    inputSchema: ParseExpenseInputSchema,
    outputSchema: ParseExpenseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
