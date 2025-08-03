-- BrokeBuster Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor to create the required tables

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  note TEXT,
  receipt_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create budgets table
CREATE TABLE IF NOT EXISTS budgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  monthly_limit DECIMAL(10,2) NOT NULL CHECK (monthly_limit > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, category)
);

-- Create user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  monthly_income DECIMAL(10,2),
  currency TEXT DEFAULT 'INR',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for expenses table
CREATE POLICY "Users can view own expenses" ON expenses
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own expenses" ON expenses
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own expenses" ON expenses
  FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete own expenses" ON expenses
  FOR DELETE USING (auth.uid() = user_id OR user_id IS NULL);

-- Create policies for budgets table  
CREATE POLICY "Users can view own budgets" ON budgets
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own budgets" ON budgets
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own budgets" ON budgets
  FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete own budgets" ON budgets
  FOR DELETE USING (auth.uid() = user_id OR user_id IS NULL);

-- Create policies for user profiles table
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_category ON budgets(category);

-- Insert some sample data (optional - remove user_id for public access)
INSERT INTO budgets (category, monthly_limit) VALUES
  ('Food & Dining', 6000),
  ('Transportation', 3000),
  ('Shopping', 4000),
  ('Rent & Bills', 12000),
  ('Entertainment', 2000)
ON CONFLICT (user_id, category) DO NOTHING;

INSERT INTO expenses (amount, category, description, date) VALUES
  (456, 'Food & Dining', 'Grocery Store', CURRENT_DATE),
  (350, 'Transportation', 'Petrol Pump', CURRENT_DATE - INTERVAL '1 day'),
  (85, 'Food & Dining', 'Cafe Coffee Day', CURRENT_DATE - INTERVAL '2 days'),
  (899, 'Shopping', 'Amazon Purchase', CURRENT_DATE - INTERVAL '3 days'),
  (1200, 'Entertainment', 'Movie Theater', CURRENT_DATE - INTERVAL '4 days'),
  (2500, 'Food & Dining', 'Zomato Orders', CURRENT_DATE - INTERVAL '5 days'),
  (180, 'Transportation', 'Uber Ride', CURRENT_DATE - INTERVAL '6 days'),
  (450, 'Shopping', 'Clothes Shopping', CURRENT_DATE - INTERVAL '1 week');
