import "./global.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation, useParams, Outlet } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider, useAuth } from "@/components/AuthContext";
import { BudgetProvider } from "@/components/BudgetContext";
import Index from "./pages/Index";
import AddExpense from "./pages/AddExpense";
import BudgetSetup from "./pages/BudgetSetup";
import DatabaseSetupPage from "./pages/DatabaseSetup";
import Reports from "./pages/Reports";
import Auth from "./pages/Auth";
import DjangoTest from "./pages/DjangoTest";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Loading component
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/80 via-white to-slate-100/80 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground">Loading BrokeBuster...</p>
      </div>
    </div>
  );
}

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/auth" replace />;
  
  return <BudgetProvider>{children}</BudgetProvider>;
}

function AppRoutes() {
  const RoutesComponent = Routes as any;
  const RouteComponent = Route as any;
  
  return (
    <RoutesComponent>
      <RouteComponent path="/auth" element={<Auth />} />
      <RouteComponent path="/" element={
        <ProtectedRoute>
          <Index />
        </ProtectedRoute>
      } />
      <RouteComponent path="/add-expense" element={
        <ProtectedRoute>
          <AddExpense />
        </ProtectedRoute>
      } />
      <RouteComponent path="/budget-setup" element={
        <ProtectedRoute>
          <BudgetSetup />
        </ProtectedRoute>
      } />
      <RouteComponent path="/database-setup" element={
        <ProtectedRoute>
          <DatabaseSetupPage />
        </ProtectedRoute>
      } />
      <RouteComponent path="/reports" element={
        <ProtectedRoute>
          <Reports />
        </ProtectedRoute>
      } />
      <RouteComponent path="/django-test" element={
        <ProtectedRoute>
          <DjangoTest />
        </ProtectedRoute>
      } />
      <RouteComponent path="*" element={<NotFound />} />
    </RoutesComponent>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
