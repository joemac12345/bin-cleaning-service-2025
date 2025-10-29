'use client';

import { useState, useEffect } from 'react';
import { Database, Save, CheckCircle, AlertCircle, Eye, EyeOff, Copy, ExternalLink, RefreshCw } from 'lucide-react';

export default function SupabaseSetup() {
  const [credentials, setCredentials] = useState({
    url: '',
    anonKey: '',
    serviceRoleKey: ''
  });
  const [showKeys, setShowKeys] = useState({
    anonKey: false,
    serviceRoleKey: false
  });
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load existing credentials on mount
  useEffect(() => {
    loadCredentials();
  }, []);

  const loadCredentials = () => {
    // In a real implementation, you might load from localStorage or an API
    const savedUrl = localStorage.getItem('supabase_url') || '';
    const savedAnonKey = localStorage.getItem('supabase_anon_key') || '';
    const savedServiceKey = localStorage.getItem('supabase_service_key') || '';
    
    setCredentials({
      url: savedUrl,
      anonKey: savedAnonKey,
      serviceRoleKey: savedServiceKey
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));
    // Reset status when user modifies credentials
    if (connectionStatus !== 'idle') {
      setConnectionStatus('idle');
      setMessage('');
    }
  };

  const toggleKeyVisibility = (keyType: 'anonKey' | 'serviceRoleKey') => {
    setShowKeys(prev => ({
      ...prev,
      [keyType]: !prev[keyType]
    }));
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setMessage(`${label} copied to clipboard!`);
    setTimeout(() => setMessage(''), 3000);
  };

  const testConnection = async () => {
    if (!credentials.url || !credentials.anonKey) {
      setMessage('Please provide both URL and anon key to test connection.');
      return;
    }

    setConnectionStatus('testing');
    setMessage('Testing connection...');

    try {
      // Test the connection by making a simple request
      const response = await fetch('/api/test-supabase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: credentials.url,
          anonKey: credentials.anonKey
        }),
      });

      const result = await response.json();

      if (result.success) {
        setConnectionStatus('success');
        setMessage('✅ Connection successful! Database is accessible.');
      } else {
        setConnectionStatus('error');
        setMessage(`❌ Connection failed: ${result.error}`);
      }
    } catch (error: any) {
      setConnectionStatus('error');
      setMessage(`❌ Connection failed: ${error.message}`);
    }
  };

  const saveCredentials = async () => {
    if (!credentials.url || !credentials.anonKey) {
      setMessage('URL and anon key are required fields.');
      return;
    }

    setIsLoading(true);
    
    try {
      // Save to localStorage (in production, you might want to save to a secure backend)
      localStorage.setItem('supabase_url', credentials.url);
      localStorage.setItem('supabase_anon_key', credentials.anonKey);
      if (credentials.serviceRoleKey) {
        localStorage.setItem('supabase_service_key', credentials.serviceRoleKey);
      }

      // Also save to environment variables via API (this would need a backend endpoint)
      const response = await fetch('/api/save-env-vars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          NEXT_PUBLIC_SUPABASE_URL: credentials.url,
          NEXT_PUBLIC_SUPABASE_ANON_KEY: credentials.anonKey,
          SUPABASE_SERVICE_ROLE_KEY: credentials.serviceRoleKey
        }),
      });

      if (response.ok) {
        setMessage('✅ Credentials saved successfully! Please restart the application for changes to take effect.');
        setConnectionStatus('success');
      } else {
        throw new Error('Failed to save credentials to environment');
      }
    } catch (error: any) {
      // Fallback to localStorage only
      setMessage('⚠️ Credentials saved locally. Note: You may need to add them to your hosting platform\'s environment variables manually.');
    } finally {
      setIsLoading(false);
    }
  };

  const createTables = async () => {
    if (connectionStatus !== 'success') {
      setMessage('Please test and confirm connection before creating tables.');
      return;
    }

    if (!credentials.serviceRoleKey) {
      setMessage('⚠️ Service role key is required to create tables automatically. You can create them manually using the SQL commands in the instructions.');
      return;
    }

    setIsLoading(true);
    setMessage('Creating database tables...');

    try {
      const response = await fetch('/api/setup-database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const result = await response.json();

      if (result.success) {
        setMessage('✅ Database tables created successfully! Your booking system is now ready to use.');
      } else {
        setMessage(`❌ Failed to create tables automatically: ${result.error}. You can create them manually using the SQL commands below.`);
      }
    } catch (error: any) {
      setMessage(`❌ Error creating tables: ${error.message}. You can create them manually using the SQL commands below.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-black to-zinc-800 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-3xl font-bold text-white">Supabase Database Setup</h1>
              <p className="text-zinc-300 mt-2">Configure your database connection and create required tables</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${
            connectionStatus === 'success' 
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
              : connectionStatus === 'error'
              ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
              : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
          }`}>
            <div className="flex items-center">
              {connectionStatus === 'success' && <CheckCircle className="w-5 h-5 mr-2" />}
              {connectionStatus === 'error' && <AlertCircle className="w-5 h-5 mr-2" />}
              <span>{message}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Setup Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Database Credentials</h2>
              
              {/* Project URL */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Project URL *
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={credentials.url}
                    onChange={(e) => handleInputChange('url', e.target.value)}
                    placeholder="https://your-project-ref.supabase.co"
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
                  />
                  {credentials.url && (
                    <button
                      onClick={() => copyToClipboard(credentials.url, 'Project URL')}
                      className="absolute right-2 top-2 p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Anon Key */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Anon/Public Key *
                </label>
                <div className="relative">
                  <input
                    type={showKeys.anonKey ? 'text' : 'password'}
                    value={credentials.anonKey}
                    onChange={(e) => handleInputChange('anonKey', e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="absolute right-2 top-2 flex space-x-1">
                    {credentials.anonKey && (
                      <button
                        onClick={() => copyToClipboard(credentials.anonKey, 'Anon key')}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => toggleKeyVisibility('anonKey')}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      {showKeys.anonKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Service Role Key */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Role Key (Optional)
                </label>
                <div className="relative">
                  <input
                    type={showKeys.serviceRoleKey ? 'text' : 'password'}
                    value={credentials.serviceRoleKey}
                    onChange={(e) => handleInputChange('serviceRoleKey', e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (for admin operations)"
                    className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="absolute right-2 top-2 flex space-x-1">
                    {credentials.serviceRoleKey && (
                      <button
                        onClick={() => copyToClipboard(credentials.serviceRoleKey, 'Service role key')}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => toggleKeyVisibility('serviceRoleKey')}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      {showKeys.serviceRoleKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={testConnection}
                  disabled={!credentials.url || !credentials.anonKey || connectionStatus === 'testing'}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {connectionStatus === 'testing' ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  Test Connection
                </button>

                <button
                  onClick={saveCredentials}
                  disabled={!credentials.url || !credentials.anonKey || isLoading}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Credentials
                </button>

                <button
                  onClick={createTables}
                  disabled={connectionStatus !== 'success' || isLoading}
                  className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Database className="w-4 h-4 mr-2" />
                  Create Tables
                </button>
              </div>
            </div>
          </div>

          {/* Instructions Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Setup Instructions</h3>
              
              <div className="space-y-4 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">1</div>
                  <div>
                    <p className="font-medium text-gray-900">Create Supabase Account</p>
                    <p className="text-gray-600 mt-1">
                      Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center">
                        supabase.com <ExternalLink className="w-3 h-3 ml-1" />
                      </a> and create a free account
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">2</div>
                  <div>
                    <p className="font-medium text-gray-900">Create New Project</p>
                    <p className="text-gray-600 mt-1">Create a new project and wait for it to initialize (~2 minutes)</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">3</div>
                  <div>
                    <p className="font-medium text-gray-900">Get Credentials</p>
                    <p className="text-gray-600 mt-1">Go to Settings → General → Configuration and copy your URL and anon key</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">4</div>
                  <div>
                    <p className="font-medium text-gray-900">Configure & Test</p>
                    <p className="text-gray-600 mt-1">Enter credentials above, test connection, then create database tables</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <h4 className="font-semibold text-amber-800 mb-2">💡 Pro Tip</h4>
              <p className="text-amber-700 text-sm">
                After setup, your bookings will persist permanently and work across all hosting platforms!
              </p>
            </div>

            {/* Manual SQL Commands */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Manual Setup (Alternative)</h3>
              <p className="text-sm text-gray-600 mb-4">
                If automatic table creation fails, you can run these SQL commands in your Supabase dashboard:
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 text-sm font-mono">
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">1. Create Bookings Table:</h4>
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap break-all">
{`CREATE TABLE IF NOT EXISTS bookings (
  id BIGSERIAL PRIMARY KEY,
  booking_id TEXT UNIQUE NOT NULL,
  service_type TEXT NOT NULL,
  customer_info JSONB NOT NULL,
  bin_selection JSONB NOT NULL,
  collection_day TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  special_instructions TEXT,
  pricing JSONB NOT NULL,
  status TEXT DEFAULT 'new-job',
  notes TEXT,
  scheduled_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);`}
                  </pre>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">2. Create Abandoned Forms Table:</h4>
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap break-all">
{`CREATE TABLE IF NOT EXISTS abandoned_forms (
  id BIGSERIAL PRIMARY KEY,
  form_id TEXT UNIQUE NOT NULL,
  form_data JSONB NOT NULL,
  abandoned_at TIMESTAMPTZ DEFAULT NOW(),
  page_url TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);`}
                  </pre>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">3. Setup Security (Optional):</h4>
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap break-all">
{`-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE abandoned_forms ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all operations)
CREATE POLICY "Allow all operations" ON bookings 
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations" ON abandoned_forms 
FOR ALL USING (true) WITH CHECK (true);`}
                  </pre>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 mt-3">
                Copy and paste these commands into the SQL Editor in your Supabase dashboard (Database → SQL Editor).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
