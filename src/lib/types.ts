export type Category = 'Food' | 'Transport' | 'Entertainment' | 'Groceries' | 'Utilities' | 'Rent' | 'Other';

export const categories: Category[] = ['Food', 'Transport', 'Entertainment', 'Groceries', 'Utilities', 'Rent', 'Other'];

export type Expense = {
  id: string;
  amount: number;
  description: string;
  category: Category;
  date: string; // Using string for date to ensure serializability between server and client
};

export type Budget = {
  category: Category;
  amount: number;
};
