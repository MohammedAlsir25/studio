'use server'

import { z } from 'zod'
import { categorizeExpenseWithAI } from '@/ai/flows/categorize-expense-with-ai'
import { generateWeeklySummary } from '@/ai/flows/generate-weekly-summary'
import type { Category, Expense } from './types'
import { categories } from './types'

// This file now only contains server actions that need a server environment, like AI calls.
// Data handling logic has been moved to a client-side context.

export async function getCategorySuggestion(description: string): Promise<{ category: Category | null }> {
  if (description.length < 3) {
    return { category: null };
  }
  try {
    const result = await categorizeExpenseWithAI({ description });
    if (result.category && categories.includes(result.category as Category)) {
      return { category: result.category as Category };
    }
    const fallbackCategory = categories.find(c => result.category.toLowerCase().includes(c.toLowerCase())) || 'Other';
    return { category: fallbackCategory as Category };
  } catch (error) {
    console.error('AI categorization failed:', error);
    return { category: null };
  }
}

export async function getWeeklySummary(expenses: Expense[]): Promise<{ summary: string }> {
  try {
    const result = await generateWeeklySummary({ expenses });
    return { summary: result.summary };
  } catch (error) {
    console.error('AI weekly summary generation failed:', error);
    throw new Error('Failed to generate weekly summary.');
  }
}
