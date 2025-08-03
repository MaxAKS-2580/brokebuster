import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useBudget } from "@/components/BudgetContext";
import { 
  ArrowLeft,
  Calendar as CalendarIcon,
  Camera,
  Coffee,
  Car,
  Home,
  ShoppingCart,
  Film,
  Plus,
  Check
} from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const categories = [
  { id: "food", name: "Food & Dining", icon: Coffee, color: "bg-orange-500" },
  { id: "transport", name: "Transportation", icon: Car, color: "bg-blue-500" },
  { id: "shopping", name: "Shopping", icon: ShoppingCart, color: "bg-purple-500" },
  { id: "rent", name: "Rent & Bills", icon: Home, color: "bg-green-500" },
  { id: "entertainment", name: "Entertainment", icon: Film, color: "bg-pink-500" },
];

export default function AddExpense() {
  const { addExpense } = useBudget();
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await addExpense({
        amount: parseFloat(amount),
        category,
        description: description || `${category} expense`,
        date: date?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
        note: note || undefined
      });

      setIsSuccess(true);

      // Reset form after success
      setTimeout(() => {
        setAmount("");
        setCategory("");
        setDescription("");
        setNote("");
        setIsSuccess(false);
      }, 2000);
    } catch (err) {
      setError("Failed to add expense. Please try again.");
      console.error('Error adding expense:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardContent className="p-8 text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-success text-success-foreground mx-auto flex items-center justify-center">
              <Check className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold">Expense Added!</h2>
            <p className="text-muted-foreground">Your expense has been successfully recorded.</p>
            <Link to="/">
              <Button className="w-full">Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
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
              <h1 className="text-xl font-bold text-foreground">Add Expense</h1>
              <p className="text-sm text-muted-foreground">Record a new expense to BrokeBuster</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Card className="max-w-2xl mx-auto border-0 shadow-lg bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle>New Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Amount *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₹</span>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-8 text-lg"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Input
                  id="description"
                  placeholder="e.g., Grocery shopping, Coffee, Gas"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-3">
                <Label>Category *</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          category === cat.id
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-muted-foreground"
                        }`}
                      >
                        <div className={`h-8 w-8 rounded-lg ${cat.color} text-white mx-auto mb-2 flex items-center justify-center`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <p className="text-sm font-medium text-center">{cat.name}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label>Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Note */}
              <div className="space-y-2">
                <Label htmlFor="note">Note (optional)</Label>
                <Textarea
                  id="note"
                  placeholder="Add a note about this expense..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Receipt Upload */}
              <div className="space-y-2">
                <Label>Receipt (optional)</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer">
                  <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload receipt image</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                </div>
              </div>

              {/* Submit Button */}
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Link to="/" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={!amount || !category || !description || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Expense
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
