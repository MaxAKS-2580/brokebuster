import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Calendar,
  PieChart,
  BarChart3,
  Download,
  Coffee,
  Car,
  Home,
  ShoppingCart,
  Film,
  Target,
  Award,
  AlertTriangle
} from "lucide-react";
import SpendingLineChart from "@/components/SpendingLineChart";

const monthlyData = [
  { month: "Oct", spent: 22000, budget: 25000 },
  { month: "Nov", spent: 18500, budget: 25000 },
  { month: "Dec", spent: 19800, budget: 25000 },
];

const categorySpending = [
  { name: "Food & Dining", icon: Coffee, spent: 4500, budget: 6000, color: "bg-orange-500", trend: -12 },
  { name: "Transportation", icon: Car, spent: 2800, budget: 3000, color: "bg-blue-500", trend: 5 },
  { name: "Shopping", icon: ShoppingCart, spent: 3200, budget: 4000, color: "bg-purple-500", trend: 23 },
  { name: "Rent & Bills", icon: Home, spent: 12000, budget: 12000, color: "bg-green-500", trend: 0 },
  { name: "Entertainment", icon: Film, spent: 1500, budget: 2000, color: "bg-pink-500", trend: -25 },
];

const achievements = [
  { id: 1, title: "Budget Master", description: "Stayed under budget for 3 months", icon: Award, color: "text-yellow-500" },
  { id: 2, title: "Savings Champion", description: "Saved ₹15,000 this quarter", icon: Target, color: "text-green-500" },
  { id: 3, title: "Expense Tracker", description: "Logged expenses for 30 days straight", icon: TrendingUp, color: "text-blue-500" },
];

const insights = [
  {
    type: "warning",
    icon: AlertTriangle,
    message: "You're spending 23% more on shopping compared to last month",
    action: "Consider setting a stricter shopping budget"
  },
  {
    type: "success", 
    icon: TrendingDown,
    message: "Great job! You've reduced food expenses by 12% this month",
    action: "Keep up the good work with meal planning"
  },
  {
    type: "info",
    icon: TrendingUp,
    message: "Your average daily spending is ₹658, which is within your target",
    action: "You're on track to meet your monthly goals"
  }
];

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");

  const totalSpent = categorySpending.reduce((sum, cat) => sum + cat.spent, 0);
  const totalBudget = categorySpending.reduce((sum, cat) => sum + cat.budget, 0);
  const avgDailySpending = totalSpent / 30;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/80 via-white to-slate-100/80 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-xl dark:bg-slate-900/80">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="icon" className="hover:bg-slate-100 dark:hover:bg-slate-800">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-foreground">Reports & Insights</h1>
                <p className="text-sm text-muted-foreground">Analyze your spending patterns and trends</p>
              </div>
            </div>
            <Button variant="outline" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-xl bg-gradient-to-br from-primary via-primary to-primary/90">
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <PieChart className="h-8 w-8 text-primary-foreground/80" />
                      <Badge className="bg-primary-foreground/20 text-primary-foreground border-0">
                        This Month
                      </Badge>
                    </div>
                    <div>
                      <p className="text-primary-foreground/90 text-sm font-medium">Total Spent</p>
                      <p className="text-3xl font-bold text-primary-foreground">₹{totalSpent.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-gradient-to-br from-green-500 via-green-500 to-green-600">
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Target className="h-8 w-8 text-white/80" />
                      <Badge className="bg-white/20 text-white border-0">
                        Budget
                      </Badge>
                    </div>
                    <div>
                      <p className="text-white/90 text-sm font-medium">Remaining</p>
                      <p className="text-3xl font-bold text-white">₹{(totalBudget - totalSpent).toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-gradient-to-br from-amber-500 via-amber-500 to-amber-600">
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Calendar className="h-8 w-8 text-white/80" />
                      <Badge className="bg-white/20 text-white border-0">
                        Daily Avg
                      </Badge>
                    </div>
                    <div>
                      <p className="text-white/90 text-sm font-medium">Per Day</p>
                      <p className="text-3xl font-bold text-white">₹{Math.round(avgDailySpending).toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Spending Chart */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-slate-900/90 mb-6">
              <CardHeader>
                <CardTitle className="text-xl">Spending Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-4">Daily Spending Pattern</h4>
                    <SpendingLineChart viewType="daily" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-4">Cumulative Monthly Spending</h4>
                    <SpendingLineChart viewType="cumulative" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Spending Insights */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-slate-900/90">
              <CardHeader>
                <CardTitle className="text-xl">Smart Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insights.map((insight, index) => {
                    const Icon = insight.icon;
                    return (
                      <div 
                        key={index} 
                        className={`p-5 rounded-xl border shadow-sm ${
                          insight.type === 'warning' ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800/50' :
                          insight.type === 'success' ? 'bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-800/50' :
                          'bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800/50'
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          <Icon className={`h-6 w-6 mt-1 ${
                            insight.type === 'warning' ? 'text-amber-600' :
                            insight.type === 'success' ? 'text-green-600' :
                            'text-blue-600'
                          }`} />
                          <div className="flex-1">
                            <p className="font-semibold text-base mb-1">{insight.message}</p>
                            <p className="text-sm text-muted-foreground">{insight.action}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-slate-900/90">
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {categorySpending.map((category) => {
                    const Icon = category.icon;
                    const usage = (category.spent / category.budget) * 100;
                    return (
                      <div key={category.name} className="space-y-3 p-4 rounded-xl bg-slate-50/80 hover:bg-slate-50 dark:bg-slate-800/80 dark:hover:bg-slate-800 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`p-3 rounded-xl ${category.color} text-white shadow-md`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-base">{category.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                ₹{category.spent.toLocaleString()} of ₹{category.budget.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant={usage > 90 ? "destructive" : usage > 70 ? "secondary" : "default"}>
                              {usage.toFixed(1)}% used
                            </Badge>
                            <p className={`text-sm mt-1 flex items-center ${category.trend > 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {category.trend > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                              {Math.abs(category.trend)}% vs last month
                            </p>
                          </div>
                        </div>
                        <Progress value={usage} className="h-3" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-slate-900/90">
              <CardHeader>
                <CardTitle>Monthly Spending Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {monthlyData.map((month) => {
                    const usage = (month.spent / month.budget) * 100;
                    return (
                      <div key={month.month} className="space-y-3">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold">{month.month} 2024</h3>
                          <div className="text-right">
                            <p className="font-bold">₹{month.spent.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">of ₹{month.budget.toLocaleString()}</p>
                          </div>
                        </div>
                        <Progress value={usage} className="h-4" />
                        <p className="text-sm text-muted-foreground">{usage.toFixed(1)}% of budget used</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {achievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <Card key={achievement.id} className="border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-slate-900/90">
                    <CardContent className="p-6 text-center space-y-4">
                      <div className={`h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto flex items-center justify-center`}>
                        <Icon className={`h-8 w-8 ${achievement.color}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{achievement.title}</h3>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        Earned
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
