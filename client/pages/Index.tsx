import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useBudget } from "@/components/BudgetContext";
import { useAuth } from "@/components/AuthContext";
import {
  PlusCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Calendar,
  PieChart,
  BarChart3,
  Settings,
  Bell,
  Wallet,
  ShoppingCart,
  Car,
  Home,
  Coffee,
  Film,
  ArrowUpRight,
  ArrowDownRight,
  Moon,
  Sun,
  AlertCircle,
  Database,
  LogOut,
  User
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import SpendingLineChart from "@/components/SpendingLineChart";

interface ExpenseCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  spent: number;
  limit: number;
  color: string;
}

interface RecentTransaction {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  type: "expense" | "income";
}

export default function Index() {
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { expenses, budgets, loading, totalSpent, totalBudget, categorySpending } = useBudget();
  const [chartView, setChartView] = useState<'daily' | 'cumulative'>('daily');
  const [monthlyIncome] = useState(45000);
  const [savingsGoal] = useState(15000);
  const currentSavings = monthlyIncome - totalSpent;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50/80 via-white to-slate-100/80 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading your financial data...</p>
        </div>
      </div>
    );
  }

  // Map budget categories with actual spending data
  const categoryIcons: Record<string, React.ReactNode> = {
    "Food & Dining": <Coffee className="h-4 w-4" />,
    "Transportation": <Car className="h-4 w-4" />,
    "Shopping": <ShoppingCart className="h-4 w-4" />,
    "Rent & Bills": <Home className="h-4 w-4" />,
    "Entertainment": <Film className="h-4 w-4" />,
  };

  const categoryColors: Record<string, string> = {
    "Food & Dining": "bg-orange-500",
    "Transportation": "bg-blue-500",
    "Shopping": "bg-purple-500",
    "Rent & Bills": "bg-green-500",
    "Entertainment": "bg-pink-500",
  };

  const categories = budgets.map(budget => ({
    id: budget.id,
    name: budget.category,
    icon: categoryIcons[budget.category] || <Target className="h-4 w-4" />,
    spent: categorySpending[budget.category] || 0,
    limit: budget.monthly_limit,
    color: categoryColors[budget.category] || "bg-slate-500",
  }));

  // Get recent transactions from Supabase
  const recentTransactions = expenses.slice(0, 4).map(expense => {
    const expenseDate = new Date(expense.date);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - expenseDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let dateText = "Today";
    if (diffDays === 1) dateText = "Yesterday";
    else if (diffDays > 1) dateText = `${diffDays} days ago`;

    return {
      id: expense.id,
      description: expense.description,
      category: expense.category,
      amount: -expense.amount, // Negative for expenses
      date: dateText,
      type: "expense" as const
    };
  });

  const budgetProgress = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const savingsProgress = (currentSavings / savingsGoal) * 100;
  const remainingBudget = totalBudget - totalSpent;

  // Check if we're using fallback data (indicating database setup needed)
  const usingFallbackData = budgets.length > 0 && budgets[0].id === '1';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/80 via-white to-slate-100/80 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-xl dark:bg-slate-900/80 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                <Wallet className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">BrokeBuster</h1>
                <p className="text-sm text-muted-foreground">Smart Financial Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              <Link to="/budget-setup">
                <Button variant="ghost" size="icon" className="hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Settings className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="hover:bg-slate-100 dark:hover:bg-slate-800">
                <Bell className="h-5 w-5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-9 px-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                        {user?.email?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium hidden sm:block">
                      {user?.email?.split('@')[0] || 'User'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-sm">{user?.email?.split('@')[0] || 'User'}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()} className="text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-4xl font-bold text-foreground">Welcome back, Akshat!</h2>
          <p className="text-lg text-muted-foreground">Here's your financial summary for December 2024</p>
        </div>

        {/* Database Setup Alert */}
        {usingFallbackData && (
          <Alert className="mb-8 border-amber-200 bg-amber-50 dark:bg-amber-900/30 dark:border-amber-800/50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="flex items-center justify-between w-full">
              <span className="text-amber-800 dark:text-amber-200">
                You're viewing sample data. Set up your Supabase database to save real expenses and budgets.
              </span>
              <Link to="/database-setup">
                <Button size="sm" variant="outline" className="ml-4 border-amber-300 text-amber-700 hover:bg-amber-100">
                  <Database className="h-4 w-4 mr-2" />
                  Setup Database
                </Button>
              </Link>
            </AlertDescription>
          </Alert>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-primary via-primary to-primary/90 hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Target className="h-8 w-8 text-primary-foreground/80" />
                  <Badge className="bg-primary-foreground/20 text-primary-foreground border-0">
                    Budget
                  </Badge>
                </div>
                <div>
                  <p className="text-primary-foreground/90 text-sm font-medium">Monthly Budget</p>
                  <p className="text-3xl font-bold text-primary-foreground">₹{totalBudget.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-red-500 via-red-500 to-red-600 hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <TrendingDown className="h-8 w-8 text-white/80" />
                  <Badge className="bg-white/20 text-white border-0">
                    Spent
                  </Badge>
                </div>
                <div>
                  <p className="text-white/90 text-sm font-medium">Total Spent</p>
                  <p className="text-3xl font-bold text-white">₹{totalSpent.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-green-500 via-green-500 to-green-600 hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <TrendingUp className="h-8 w-8 text-white/80" />
                  <Badge className="bg-white/20 text-white border-0">
                    Income
                  </Badge>
                </div>
                <div>
                  <p className="text-white/90 text-sm font-medium">Monthly Income</p>
                  <p className="text-3xl font-bold text-white">₹{monthlyIncome.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-amber-500 via-amber-500 to-amber-600 hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Wallet className="h-8 w-8 text-white/80" />
                  <Badge className="bg-white/20 text-white border-0">
                    Left
                  </Badge>
                </div>
                <div>
                  <p className="text-white/90 text-sm font-medium">Remaining</p>
                  <p className="text-3xl font-bold text-white">₹{remainingBudget.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Budget Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-slate-900/90">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center justify-between text-xl">
                <span>Budget Overview</span>
                <Badge
                  variant={budgetProgress > 80 ? "destructive" : budgetProgress > 60 ? "secondary" : "default"}
                  className="text-sm px-3 py-1"
                >
                  {budgetProgress.toFixed(1)}% used
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between text-base font-medium">
                  <span>Monthly Progress</span>
                  <span>₹{totalSpent.toLocaleString()} / ₹{totalBudget.toLocaleString()}</span>
                </div>
                <Progress value={budgetProgress} className="h-4" />
              </div>

              <div className="space-y-6">
                <h4 className="text-lg font-semibold">Category Breakdown</h4>
                {categories.slice(0, 4).map((category) => {
                  const categoryProgress = (category.spent / category.limit) * 100;
                  return (
                    <div key={category.id} className="space-y-3 p-4 rounded-xl bg-slate-50/80 hover:bg-slate-50 dark:bg-slate-800/80 dark:hover:bg-slate-800 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-3 rounded-xl ${category.color} text-white shadow-md`}>
                            {category.icon}
                          </div>
                          <span className="font-semibold text-base">{category.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">₹{category.spent.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">of ₹{category.limit.toLocaleString()}</p>
                        </div>
                      </div>
                      <Progress
                        value={categoryProgress}
                        className="h-3"
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-8">
            {/* Savings Goal */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-emerald-800">Savings Goal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center space-y-2">
                  <p className="text-3xl font-bold text-emerald-700">₹{currentSavings.toLocaleString()}</p>
                  <p className="text-base text-emerald-600">of ₹{savingsGoal.toLocaleString()} goal</p>
                </div>
                <Progress value={savingsProgress} className="h-4" />
                <p className="text-sm text-center text-emerald-600 font-medium">
                  ₹{(savingsGoal - currentSavings).toLocaleString()} to go
                </p>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-slate-900/90">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link to="/add-expense">
                  <Button className="w-full justify-start h-12 text-base" size="lg">
                    <PlusCircle className="h-5 w-5 mr-3" />
                    Add Expense
                  </Button>
                </Link>
                <Link to="/reports">
                  <Button variant="outline" className="w-full justify-start h-12 text-base" size="lg">
                    <BarChart3 className="h-5 w-5 mr-3" />
                    View Reports
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Spending Tracker Chart */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-slate-900/90 mb-8">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center justify-between text-xl">
              <span>{chartView === 'daily' ? 'Daily' : 'Cumulative'} Spending Tracker</span>
              <div className="flex space-x-2">
                <Button
                  variant={chartView === 'daily' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setChartView('daily')}
                  className="text-xs h-7"
                >
                  Daily
                </Button>
                <Button
                  variant={chartView === 'cumulative' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setChartView('cumulative')}
                  className="text-xs h-7"
                >
                  Cumulative
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SpendingLineChart viewType={chartView} />
            <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-muted-foreground">Daily Spending</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-1 bg-red-500"></div>
                <span className="text-muted-foreground">
                  {chartView === 'daily' ? 'Average: ₹658/day' : 'Month Progress: 73%'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-slate-900/90">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center justify-between text-xl">
              <span>Recent Transactions</span>
              <Link to="/reports">
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                  View All
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.slice(0, 4).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-5 rounded-xl bg-gradient-to-r from-slate-50/80 to-slate-100/50 hover:from-slate-100/80 hover:to-slate-200/50 dark:from-slate-800/80 dark:to-slate-700/50 dark:hover:from-slate-700/80 dark:hover:to-slate-600/50 transition-all duration-200 border border-slate-200/50 dark:border-slate-700/50">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl shadow-md ${
                      transaction.type === "income" ? "bg-green-500 text-white" : "bg-red-500 text-white"
                    }`}>
                      {transaction.type === "income" ?
                        <ArrowUpRight className="h-5 w-5" /> :
                        <ArrowDownRight className="h-5 w-5" />
                      }
                    </div>
                    <div>
                      <p className="font-semibold text-base">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">{transaction.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-lg ${
                      transaction.type === "income" ? "text-green-600" : "text-red-600"
                    }`}>
                      {transaction.type === "income" ? "+" : ""}₹{Math.abs(transaction.amount).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground font-medium">{transaction.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 dark:bg-gradient-to-r dark:from-slate-900/90 dark:via-slate-800/90 dark:to-slate-900/90">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center space-x-3 text-xl">
              <TrendingUp className="h-6 w-6 text-primary" />
              <span>Smart Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-amber-50 border border-amber-200 shadow-sm dark:bg-amber-900/30 dark:border-amber-800/50">
                <p className="text-base font-semibold text-amber-800">
                  🚨 You're close to your Transportation limit! Only ₹200 remaining.
                </p>
              </div>
              <div className="p-5 rounded-xl bg-green-50 border border-green-200 shadow-sm dark:bg-green-900/30 dark:border-green-800/50">
                <p className="text-base font-semibold text-green-800">
                  🎉 Great job! You've spent 25% less on entertainment this month.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
