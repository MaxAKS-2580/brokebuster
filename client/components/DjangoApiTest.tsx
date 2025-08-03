import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { djangoApi } from '@/lib/django-api';

interface ApiResponse {
  message?: string;
  status?: string;
  service?: string;
  version?: string;
  data?: any;
  timestamp?: string;
}

export default function DjangoApiTest() {
  const [responses, setResponses] = React.useState<Record<string, ApiResponse | null>>({
    health: null,
    ping: null,
    demo: null,
  });
  const [loading, setLoading] = React.useState<Record<string, boolean>>({
    health: false,
    ping: false,
    demo: false,
  });
  const [errors, setErrors] = React.useState<Record<string, string | null>>({
    health: null,
    ping: null,
    demo: null,
  });

  const testEndpoint = async (endpoint: 'health' | 'ping' | 'demo') => {
    setLoading(prev => ({ ...prev, [endpoint]: true }));
    setErrors(prev => ({ ...prev, [endpoint]: null }));
    
    try {
      let response: ApiResponse;
      switch (endpoint) {
        case 'health':
          response = await djangoApi.healthCheck();
          break;
        case 'ping':
          response = await djangoApi.ping();
          break;
        case 'demo':
          response = await djangoApi.demo();
          break;
        default:
          throw new Error('Unknown endpoint');
      }
      
      setResponses(prev => ({ ...prev, [endpoint]: response }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setErrors(prev => ({ ...prev, [endpoint]: errorMessage }));
    } finally {
      setLoading(prev => ({ ...prev, [endpoint]: false }));
    }
  };

  const testAllEndpoints = async () => {
    await Promise.all([
      testEndpoint('health'),
      testEndpoint('ping'),
      testEndpoint('demo'),
    ]);
  };

  React.useEffect(() => {
    // Test health endpoint on component mount
    testEndpoint('health');
  }, []);

  const getStatusText = (endpoint: string) => {
    if (loading[endpoint]) return 'Testing...';
    if (errors[endpoint]) return 'Error';
    if (responses[endpoint]) return 'Success';
    return 'Not tested';
  };

  const getStatusColor = (endpoint: string) => {
    if (loading[endpoint]) return 'text-yellow-600';
    if (errors[endpoint]) return 'text-red-600';
    if (responses[endpoint]) return 'text-green-600';
    return 'text-gray-500';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Django Backend API Test</CardTitle>
          <CardDescription>
            Test the connection between your React frontend and Django backend
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={testAllEndpoints} disabled={Object.values(loading).some(Boolean)}>
              Test All Endpoints
            </Button>
          </div>

          <div className="grid gap-4">
            {/* Health Check */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Health Check</CardTitle>
                  <span className={`text-sm font-medium ${getStatusColor('health')}`}>
                    {getStatusText('health')}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => testEndpoint('health')}
                  disabled={loading.health}
                >
                  {loading.health ? 'Testing...' : 'Test /api/health/'}
                </Button>
                {responses.health && (
                  <pre className="text-xs bg-muted p-2 rounded">
                    {JSON.stringify(responses.health, null, 2)}
                  </pre>
                )}
                {errors.health && (
                  <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                    Error: {errors.health}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Ping */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Ping</CardTitle>
                  <span className={`text-sm font-medium ${getStatusColor('ping')}`}>
                    {getStatusText('ping')}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => testEndpoint('ping')}
                  disabled={loading.ping}
                >
                  {loading.ping ? 'Testing...' : 'Test /api/ping/'}
                </Button>
                {responses.ping && (
                  <pre className="text-xs bg-muted p-2 rounded">
                    {JSON.stringify(responses.ping, null, 2)}
                  </pre>
                )}
                {errors.ping && (
                  <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                    Error: {errors.ping}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Demo */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Demo</CardTitle>
                  <span className={`text-sm font-medium ${getStatusColor('demo')}`}>
                    {getStatusText('demo')}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => testEndpoint('demo')}
                  disabled={loading.demo}
                >
                  {loading.demo ? 'Testing...' : 'Test /api/demo/'}
                </Button>
                {responses.demo && (
                  <pre className="text-xs bg-muted p-2 rounded">
                    {JSON.stringify(responses.demo, null, 2)}
                  </pre>
                )}
                {errors.demo && (
                  <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                    Error: {errors.demo}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
