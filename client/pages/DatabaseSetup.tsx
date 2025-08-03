import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import DatabaseSetup from "@/components/DatabaseSetup";

export default function DatabaseSetupPage() {
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
              <h1 className="text-xl font-bold text-foreground">Database Setup</h1>
              <p className="text-sm text-muted-foreground">Configure your Supabase database for BrokeBuster</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-8">
        <DatabaseSetup />
      </div>
    </div>
  );
}
