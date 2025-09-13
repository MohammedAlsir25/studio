'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { categorizeExpenseWithAI } from '@/ai/flows/categorize-expense-with-ai'
import type { Expense, Budget, Category } from './types'
import { categories } from './types'

// In-memory store for demonstration purposes.
// In a real application, you would use a database.
let expenses: Expense[] = [
  { id: '1', description: 'Coffee with friends', amount: 12.5, category: 'Food', date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString() },
  { id: '2', description: 'Monthly train pass', amount: 85, category: 'Transport', date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString() },
  { id: '3', description: 'Movie tickets', amount: 30, category: 'Entertainment', date: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString() },
  { id: '4', description: 'Weekly groceries', amount: 120.75, category: 'Groceries', date: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString() },
  { id: '5', description: 'Electricity bill', amount: 75.2, category: 'Utilities', date: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString() },
];

let budgets: Budget[] = [
  { category: 'Food', amount: 400 },
  { category: 'Transport', amount: 150 },
  { category: 'Entertainment', amount: 100 },
  { category: 'Groceries', amount: 500 },
  { category: 'Utilities', amount: 200 },
  { category: 'Rent', amount: 1500 },
  { category: 'Other', amount: 200 },
];

export async function getExpenses() {
  return expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getBudgets() {
  return budgets;
}

const expenseSchema = z.object({
  description: z.string().min(1, 'Description is required.'),
  amount: z.coerce.number().gt(0, 'Amount must be positive.'),
  category: z.enum(categories),
  date: z.string().min(1, 'Date is required.'),
})

export async function addExpense(formData: FormData) {
  const validatedFields = expenseSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const newExpense: Expense = {
    id: Date.now().toString(),
    ...validatedFields.data,
  };

  expenses.unshift(newExpense);

  revalidatePath('/dashboard');
  revalidatePath('/expenses');
  revalidatePath('/reports');

  return { success: true };
}

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

export async function updateBudgets(formData: FormData) {
    const newBudgets: Budget[] = [];
    for (const [key, value] of formData.entries()) {
        if(categories.includes(key as Category)) {
            const amount = parseFloat(value as string);
            if (!isNaN(amount) && amount >= 0) {
                newBudgets.push({ category: key as Category, amount });
            }
        }
    }
    
    budgets = newBudgets;
    
    revalidatePath('/dashboard');
    revalidatePath('/budgets');

    return { success: true };
}
