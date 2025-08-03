import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useBudget } from "@/components/BudgetContext";
import { 
  ArrowLeft,
  Target,
  Coffee,
  Car,
  Home,
  ShoppingCart,
  Film,
  Gamepad2,
  Heart,
  Briefcase,
  Plus,
  Save,
  Check
} from "lucide-react";

const defaultCategories = [
  { id: "food", name: "Food & Dining", icon: Coffee, color: "bg-orange-500", limit: 6000 },
  { id: "transport", name: "Transportation", icon: Car, color: "bg-blue-500", limit: 3000 },
  { id: "shopping", name: "Shopping", icon: ShoppingCart, color: "bg-purple-500", limit: 4000 },
  { id: "rent", name: "Rent & Bills", icon: Home, color: "bg-green-500", limit: 12000 },
  { id: "entertainment", name: "Entertainment", icon: Film, color: "bg-pink-500", limit: 2000 },
  { id: "health", name: "Healthcare", icon: Heart, color: "bg-red-500", limit: 3000 },
  { id: "work", name: "Work Related", icon: Briefcase, color: "bg-indigo-500", limit: 1500 },
  { id: "gaming", name: "Gaming", icon: Gamepad2, color: "bg-cyan-500", limit: 1000 },
];

export default function BudgetSetup() {
  const { setBudgetLimit, budgets } = useBudget();
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [categories, setCategories] = useState(defaultCategories);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const updateCategoryLimit = (id: string, limit: number) => {
    setCategories(prev => 
      prev.map(cat => cat.id === id ? { ...cat, limit } : cat)
    );
  };

  const totalBudget = categories.reduce((sum, cat) => sum + cat.limit, 0);
  const savingsAmount = monthlyIncome ? parseInt(monthlyIncome) - totalBudget : 0;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      console.log('Saving budget categories:', categories);

      // Save all budget categories
      await Promise.all(
        categories.map(category => {
          console.log('Saving category:', category.name, 'with limit:', category.limit);
          return setBudgetLimit(category.name, category.limit);
        })
      );

      console.log('All budgets saved successfully!');
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
    } catch (error) {
      console.error('Error saving budget:', error);
      console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
      alert(`Failed to save budget: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50/80 via-white to-slate-100/80 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Card className="w-full max-w-md border-0 shadow-lg bg-white dark:bg-slate-900">
          <CardContent className="p-8 text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-green-500 text-white mx-auto flex items-center justify-center">
              <Check className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold">Budget Saved!</h2>
            <p className="text-muted-foreground">Your budget plan has been successfully configured.</p>
            <Link to="/">
              <Button className="w-full">Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/80 via-white to-slate-100/80 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-xl dark:bg-slate-900/80">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="icon" className="hover:bg-slate-100 dark:hover:bg-slate-800">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground">Budget Setup</h1>
              <p className="text-sm text-muted-foreground">Configure your monthly budget and category limits</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Monthly Income */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-slate-900/90 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <Target className="h-6 w-6 text-primary" />
              <span>Monthly Income</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="income">Enter your monthly income</Label>
                <div className="relative mt-2">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₹</span>
                  <Input
                    id="income"
                    type="number"
                    placeholder="45,000"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                    className="pl-8 text-lg"
                  />
                </div>
              </div>
              
              {monthlyIncome && (
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Budget</p>
                      <p className="text-lg font-bold">₹{totalBudget.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Planned Savings</p>
                      <p className={`text-lg font-bold ${savingsAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ₹{Math.abs(savingsAmount).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Savings Rate</p>
                      <p className={`text-lg font-bold ${savingsAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {monthlyIncome ? ((savingsAmount / parseInt(monthlyIncome)) * 100).toFixed(1) : 0}%
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Category Limits */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-slate-900/90">
          <CardHeader>
            <CardTitle>Category Budget Limits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <div key={category.id} className="space-y-3 p-4 rounded-xl bg-slate-50/80 hover:bg-slate-50 dark:bg-slate-800/80 dark:hover:bg-slate-800 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-xl ${category.color} text-white shadow-md`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">Monthly limit</p>
                      </div>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₹</span>
                      <Input
                        type="number"
                        value={category.limit}
                        onChange={(e) => updateCategoryLimit(category.id, parseInt(e.target.value) || 0)}
                        className="pl-8"
                      />
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>
                        {monthlyIncome ? ((category.limit / parseInt(monthlyIncome)) * 100).toFixed(1) : 0}% of income
                      </span>
                      <Badge variant="outline" className="text-xs">
                        ₹{category.limit.toLocaleString()}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex gap-4">
              <Link to="/" className="flex-1">
                <Button variant="outline" className="w-full h-12">
                  Cancel
                </Button>
              </Link>
              <Button onClick={handleSave} className="flex-1 h-12" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    Save Budget Plan
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
