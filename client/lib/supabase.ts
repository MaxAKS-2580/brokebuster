import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bnkmzirutnmslqbbjqul.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJua216aXJ1dG5tc2xxYmJqcXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMjc2MzgsImV4cCI6MjA2OTgwMzYzOH0.dU1ukm2KP2F63OBxh_N66UnDKOSdvTaknPPTVv1KPf0';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database Types
export interface Expense {
  id: string;
  user_id?: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  note?: string;
  receipt_url?: string;
  created_at: string;
}

export interface Budget {
  id: string;
  user_id?: string;
  category: string;
  monthly_limit: number;
  created_at: string;
}

export interface UserProfile {
  id: string;
  monthly_income?: number;
  currency: string;
  created_at: string;
}

// Check if tables exist
let tablesExist = true;

// Database Operations
export const DatabaseService = {
  // Expenses
  async getExpenses(userId?: string) {
    console.log('Getting expenses for user:', userId);

    let query = supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false })
      .limit(50);

    // If userId is provided, filter by user_id, otherwise get all (for demo)
    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Detailed expenses error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });

      // If table doesn't exist, return sample data
      if (error.code === 'PGRST106' || error.message.includes('does not exist')) {
        console.warn('Expenses table does not exist, using sample data');
        const today = new Date();
        return [
          {
            id: '1',
            amount: 456,
            category: 'Food & Dining',
            description: 'Grocery Store',
            date: today.toISOString().split('T')[0],
            created_at: today.toISOString()
          },
          {
            id: '2',
            amount: 350,
            category: 'Transportation',
            description: 'Petrol Pump',
            date: new Date(today.getTime() - 24*60*60*1000).toISOString().split('T')[0],
            created_at: new Date(today.getTime() - 24*60*60*1000).toISOString()
          }
        ];
      }

      throw new Error(`Failed to get expenses: ${error.message}`);
    }
    return data || [];
  },

  async addExpense(expense: Omit<Expense, 'id' | 'created_at'>, userId?: string) {
    const expenseWithUser = {
      ...expense,
      user_id: userId || null
    };
    console.log('Adding expense:', expenseWithUser);

    const { data, error } = await supabase
      .from('expenses')
      .insert([expenseWithUser])
      .select()
      .single();

    if (error) {
      console.error('Detailed expense error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });

      // If table doesn't exist, simulate success
      if (error.code === 'PGRST106' || error.message.includes('does not exist')) {
        console.warn('Expenses table does not exist, simulating success');
        return {
          id: Date.now().toString(),
          ...expense,
          created_at: new Date().toISOString()
        };
      }

      throw new Error(`Failed to add expense: ${error.message}`);
    }
    return data;
  },

  async deleteExpense(id: string) {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Budget Categories
  async getBudgets(userId?: string) {
    console.log('Getting budgets for user:', userId);

    let query = supabase
      .from('budgets')
      .select('*');

    // If userId is provided, filter by user_id, otherwise get all (for demo)
    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Detailed budgets error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });

      // If table doesn't exist, return default budgets
      if (error.code === 'PGRST106' || error.message.includes('does not exist')) {
        console.warn('Budgets table does not exist, using default data');
        return [
          { id: '1', category: 'Food & Dining', monthly_limit: 6000, created_at: new Date().toISOString() },
          { id: '2', category: 'Transportation', monthly_limit: 3000, created_at: new Date().toISOString() },
          { id: '3', category: 'Shopping', monthly_limit: 4000, created_at: new Date().toISOString() },
          { id: '4', category: 'Rent & Bills', monthly_limit: 12000, created_at: new Date().toISOString() },
          { id: '5', category: 'Entertainment', monthly_limit: 2000, created_at: new Date().toISOString() }
        ];
      }

      throw new Error(`Failed to get budgets: ${error.message}`);
    }
    return data || [];
  },

  async setBudget(budget: Omit<Budget, 'id' | 'created_at'>, userId?: string) {
    const budgetWithUser = {
      ...budget,
      user_id: userId || null
    };
    console.log('Setting budget:', budgetWithUser);

    const { data, error } = await supabase
      .from('budgets')
      .upsert([budgetWithUser], {
        onConflict: userId ? 'user_id,category' : 'category',
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (error) {
      console.error('Detailed budget error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });

      // If table doesn't exist, simulate success
      if (error.code === 'PGRST106' || error.message.includes('does not exist')) {
        console.warn('Budgets table does not exist, simulating success');
        return {
          id: Date.now().toString(),
          ...budget,
          created_at: new Date().toISOString()
        };
      }

      throw new Error(`Failed to set budget: ${error.message}`);
    }
    return data;
  },

  // User Profile
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async updateUserProfile(profile: Partial<UserProfile> & { id: string }) {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert([profile])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Analytics
  async getMonthlySpending(year: number, month: number) {
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = `${year}-${(month + 1).toString().padStart(2, '0')}-01`;
    
    const { data, error } = await supabase
      .from('expenses')
      .select('amount, category, date')
      .gte('date', startDate)
      .lt('date', endDate);
    
    if (error) throw error;
    return data || [];
  },

  async getCategorySpending() {
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    
    const { data, error } = await supabase
      .from('expenses')
      .select('amount, category')
      .like('date', `${currentMonth}%`);
    
    if (error) throw error;
    
    // Group by category
    const categoryTotals: Record<string, number> = {};
    data?.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });
    
    return categoryTotals;
  }
};
