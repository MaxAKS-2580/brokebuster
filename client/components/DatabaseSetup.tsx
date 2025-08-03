import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Database,
  Copy,
  Check,
  ExternalLink,
  AlertCircle
} from "lucide-react";

const SQL_SCRIPT = `-- BrokeBuster Database Schema for Supabase
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

-- Enable Row Level Security (RLS)
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- Create policies for expenses table
CREATE POLICY "Allow public access to expenses" ON expenses FOR ALL USING (true);
CREATE POLICY "Allow public access to budgets" ON budgets FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_budgets_category ON budgets(category);

-- Insert sample data
INSERT INTO budgets (category, monthly_limit) VALUES
  ('Food & Dining', 6000),
  ('Transportation', 3000),
  ('Shopping', 4000),
  ('Rent & Bills', 12000),
  ('Entertainment', 2000)
ON CONFLICT DO NOTHING;

INSERT INTO expenses (amount, category, description, date) VALUES
  (456, 'Food & Dining', 'Grocery Store', CURRENT_DATE),
  (350, 'Transportation', 'Petrol Pump', CURRENT_DATE - INTERVAL '1 day'),
  (85, 'Food & Dining', 'Cafe Coffee Day', CURRENT_DATE - INTERVAL '2 days'),
  (899, 'Shopping', 'Amazon Purchase', CURRENT_DATE - INTERVAL '3 days'),
  (1200, 'Entertainment', 'Movie Theater', CURRENT_DATE - INTERVAL '4 days');`;

export default function DatabaseSetup() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(SQL_SCRIPT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="border-0 shadow-xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
        <CardHeader className="text-center">
          <div className="h-16 w-16 rounded-full bg-primary/20 mx-auto flex items-center justify-center mb-4">
            <Database className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Database Setup Required</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              To use BrokeBuster with full functionality, you need to set up the database tables in your Supabase project.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Setup Steps:</h3>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Badge className="bg-primary text-primary-foreground min-w-[24px] h-6 flex items-center justify-center">1</Badge>
                <div>
                  <p className="font-medium">Open your Supabase dashboard</p>
                  <p className="text-sm text-muted-foreground">Go to your project at supabase.com</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Badge className="bg-primary text-primary-foreground min-w-[24px] h-6 flex items-center justify-center">2</Badge>
                <div>
                  <p className="font-medium">Navigate to SQL Editor</p>
                  <p className="text-sm text-muted-foreground">Click on "SQL Editor" in the left sidebar</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Badge className="bg-primary text-primary-foreground min-w-[24px] h-6 flex items-center justify-center">3</Badge>
                <div>
                  <p className="font-medium">Copy and run the SQL script</p>
                  <p className="text-sm text-muted-foreground">Paste the script below and click "Run"</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Badge className="bg-primary text-primary-foreground min-w-[24px] h-6 flex items-center justify-center">4</Badge>
                <div>
                  <p className="font-medium">Refresh BrokeBuster</p>
                  <p className="text-sm text-muted-foreground">Come back here and refresh the page</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Database Schema SQL:</h4>
              <Button 
                onClick={copyToClipboard}
                variant="outline" 
                size="sm"
                className="flex items-center space-x-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy SQL</span>
                  </>
                )}
              </Button>
            </div>
            
            <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-green-400 text-sm whitespace-pre-wrap font-mono">
                {SQL_SCRIPT}
              </pre>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
              className="flex-1 flex items-center justify-center space-x-2"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Open Supabase Dashboard</span>
            </Button>
            
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              className="flex-1"
            >
              Refresh Page
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Current Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Expenses Table</span>
              <Badge variant="destructive">Not Found</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Budgets Table</span>
              <Badge variant="destructive">Not Found</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              The app is currently running with sample data. Set up the database to save your real expenses and budgets.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
