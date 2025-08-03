import * as React from 'react';
import DjangoApiTestSimple from "@/components/DjangoApiTestSimple";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function DjangoTest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/80 via-white to-slate-100/80 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Django Backend Integration</CardTitle>
              <CardDescription>
                Test and verify the connection between your React frontend and the new Django backend.
                Make sure the Django server is running on http://localhost:8000 before testing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Getting Started
                  </h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200">
                    <li>Navigate to the <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">django_backend</code> directory</li>
                    <li>Install dependencies: <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">pip install -r requirements.txt</code></li>
                    <li>Run migrations: <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">python manage.py migrate</code></li>
                    <li>Start the server: <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">python manage.py runserver 8000</code></li>
                    <li>Test the API endpoints below</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Test Component */}
          <DjangoApiTestSimple />
        </div>
      </div>
    </div>
  );
}
