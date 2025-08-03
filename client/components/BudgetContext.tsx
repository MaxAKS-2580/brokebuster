import React, { createContext, useContext, useEffect, useState } from 'react';
import { DatabaseService, Expense, Budget } from '@/lib/supabase';
import { useAuth } from './AuthContext';

interface BudgetContextType {
  expenses: Expense[];
  budgets: Budget[];
  loading: boolean;
  addExpense: (expense: Omit<Expense, 'id' | 'created_at' | 'user_id'>) => Promise<void>;
  setBudgetLimit: (category: string, limit: number) => Promise<void>;
  refreshData: () => Promise<void>;
  totalSpent: number;
  totalBudget: number;
  categorySpending: Record<string, number>;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export function BudgetProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  // Calculate derived values
  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthExpenses = expenses.filter(expense => 
    expense.date.startsWith(currentMonth)
  );
  
  const totalSpent = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.monthly_limit, 0);
  
  const categorySpending: Record<string, number> = {};
  currentMonthExpenses.forEach(expense => {
    categorySpending[expense.category] = (categorySpending[expense.category] || 0) + expense.amount;
  });

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('Loading data from Supabase...');

      const [expensesData, budgetsData] = await Promise.all([
        DatabaseService.getExpenses(user?.id),
        DatabaseService.getBudgets(user?.id)
      ]);

      console.log('Loaded expenses:', expensesData.length);
      console.log('Loaded budgets:', budgetsData.length);

      setExpenses(expensesData);
      setBudgets(budgetsData);
    } catch (error) {
      console.error('Error loading data:', error);
      console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (expenseData: Omit<Expense, 'id' | 'created_at' | 'user_id'>) => {
    try {
      const newExpense = await DatabaseService.addExpense(expenseData, user?.id);
      setExpenses(prev => [newExpense, ...prev]);
    } catch (error) {
      console.error('Error adding expense:', error);
      throw error;
    }
  };

  const setBudgetLimit = async (category: string, limit: number) => {
    try {
      console.log('Setting budget limit:', { category, limit });

      const budgetData = await DatabaseService.setBudget({
        category,
        monthly_limit: limit
      }, user?.id);

      console.log('Budget set successfully:', budgetData);

      setBudgets(prev => {
        const existing = prev.find(b => b.category === category);
        if (existing) {
          return prev.map(b => b.category === category ? budgetData : b);
        } else {
          return [...prev, budgetData];
        }
      });
    } catch (error) {
      console.error('Error setting budget:', error);
      console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  };

  const refreshData = async () => {
    await loadData();
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const value: BudgetContextType = {
    expenses,
    budgets,
    loading,
    addExpense,
    setBudgetLimit,
    refreshData,
    totalSpent,
    totalBudget,
    categorySpending
  };

  return (
    <BudgetContext.Provider value={value}>
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
}
