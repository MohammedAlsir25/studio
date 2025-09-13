'use client';

import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import type { Expense, Budget } from '@/lib/types';

interface DataContextType {
  expenses: Expense[];
  budgets: Budget[];
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  updateExpense: (expense: Expense) => Promise<void>;
  deleteExpense: (expenseId: string) => Promise<void>;
  updateBudgets: (budgets: Budget[]) => Promise<void>;
  clearAllData: () => Promise<void>;
  loading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Default initial data
const initialExpenses: Expense[] = [
    { id: '1', description: 'Coffee with friends', amount: 12.5, category: 'Food', date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString() },
    { id: '2', description: 'Monthly train pass', amount: 85, category: 'Transport', date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString() },
    { id: '3', description: 'Movie tickets', amount: 30, category: 'Entertainment', date: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString() },
    { id: '4', description: 'Weekly groceries', amount: 120.75, category: 'Groceries', date: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString() },
    { id: '5', description: 'Electricity bill', amount: 75.2, category: 'Utilities', date: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString() },
];

const initialBudgets: Budget[] = [
    { category: 'Food', amount: 400 },
    { category: 'Transport', amount: 150 },
    { category: 'Entertainment', amount: 100 },
    { category: 'Groceries', amount: 500 },
    { category: 'Utilities', amount: 200 },
    { category: 'Rent', amount: 1500 },
    { category: 'Other', amount: 200 },
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedExpenses = localStorage.getItem('expenses');
      if (storedExpenses) {
        setExpenses(JSON.parse(storedExpenses));
      } else {
        setExpenses(initialExpenses);
        localStorage.setItem('expenses', JSON.stringify(initialExpenses));
      }

      const storedBudgets = localStorage.getItem('budgets');
      if (storedBudgets) {
        setBudgets(JSON.parse(storedBudgets));
      } else {
        setBudgets(initialBudgets);
        localStorage.setItem('budgets', JSON.stringify(initialBudgets));
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      setExpenses(initialExpenses);
      setBudgets(initialBudgets);
    } finally {
      setLoading(false);
    }
  }, []);

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = { ...expense, id: Date.now().toString() };
    const updatedExpenses = [newExpense, ...expenses];
    setExpenses(updatedExpenses);
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
  };
  
  const updateExpense = async (updatedExpense: Expense) => {
    const updatedExpenses = expenses.map(expense =>
      expense.id === updatedExpense.id ? updatedExpense : expense
    );
    setExpenses(updatedExpenses);
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
  };

  const deleteExpense = async (expenseId: string) => {
    const updatedExpenses = expenses.filter(expense => expense.id !== expenseId);
    setExpenses(updatedExpenses);
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
  };

  const updateBudgets = async (newBudgets: Budget[]) => {
    setBudgets(newBudgets);
    localStorage.setItem('budgets', JSON.stringify(newBudgets));
  };
  
  const clearAllData = useCallback(async () => {
    setExpenses([]);
    setBudgets([]);
    localStorage.removeItem('expenses');
    localStorage.removeItem('budgets');
  }, []);

  const value = {
    expenses: expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    budgets,
    addExpense,
    updateExpense,
    deleteExpense,
    updateBudgets,
    clearAllData,
    loading,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
