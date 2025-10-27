'use client';

import { useState, useEffect } from 'react';
import { Cloud, Save, CheckCircle, AlertCircle, Eye, EyeOff, Copy, ExternalLink, RefreshCw, Globe, Database } from 'lucide-react';

interface DeploymentConfig {
  // Supabase
  supabaseUrl: string;
  supabaseAnonKey: string;
  
  // Resend Email
  resendApiKey: string;
  resendFromEmail: string;
  adminEmail: string;
  
  // Application
  baseUrl: string;
}

export default function DeploymentSetup() {
  const [config, setConfig] = useState<DeploymentConfig>({
    supabaseUrl: '',
    supabaseAnonKey: '',
    resendApiKey: '',
    resendFromEmail: 'onboarding@resend.dev',
    adminEmail: '',
    baseUrl: 'https://your-site.netlify.app'
  });

  const [showKeys, setShowKeys] = useState({
    supabaseAnonKey: false,
    resendApiKey: false
  });

  const [connectionStatus, setConnectionStatus] = useState<{
    supabase: 'idle' | 'testing' | 'success' | 'error';
    email: 'idle' | 'testing' | 'success' | 'error';
    overall: 'idle' | 'testing' | 'success' | 'error';
  }>({
    supabase: 'idle',
    email: 'idle',
    overall: 'idle'
  });

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load existing configuration on mount
  useEffect(() => {
    loadConfiguration();
  }, []);

  const loadConfiguration = () => {
    // Load from localStorage and current environment
    const savedConfig = {
      supabaseUrl: localStorage.getItem('deployment_supabase_url') || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      supabaseAnonKey: localStorage.getItem('deployment_supabase_key') || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      resendApiKey: localStorage.getItem('deployment_resend_key') || '',
      resendFromEmail: localStorage.getItem('deployment_from_email') || 'onboarding@resend.dev',
      adminEmail: localStorage.getItem('deployment_admin_email') || '',
      baseUrl: localStorage.getItem('deployment_base_url') || 'https://your-site.netlify.app'
    };
    
    setConfig(savedConfig);
  };

  const handleInputChange = (field: keyof DeploymentConfig, value: string) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Reset status when user modifies configuration
    setConnectionStatus(prev => ({
      ...prev,
      overall: 'idle'
    }));
    setMessage('');
  };

  const toggleKeyVisibility = (keyType: 'supabaseAnonKey' | 'resendApiKey') => {
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

  const testSupabaseConnection = async () => {
    if (!config.supabaseUrl || !config.supabaseAnonKey) {
      setMessage('Please provide both Supabase URL and anon key.');
      return;
    }

    setConnectionStatus(prev => ({ ...prev, supabase: 'testing' }));

    try {
      const response = await fetch('/api/test-supabase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: config.supabaseUrl,
          anonKey: config.supabaseAnonKey
        }),
      });

      const result = await response.json();

      if (result.success) {
        setConnectionStatus(prev => ({ ...prev, supabase: 'success' }));
        setMessage('✅ Supabase connection successful!');
      } else {
        setConnectionStatus(prev => ({ ...prev, supabase: 'error' }));
        setMessage(`❌ Supabase connection failed: ${result.error}`);
      }
    } catch (error: any) {
      setConnectionStatus(prev => ({ ...prev, supabase: 'error' }));
      setMessage(`❌ Supabase connection failed: ${error.message}`);
    }
  };

  const testEmailConnection = async () => {
    if (!config.resendApiKey || !config.adminEmail) {
      setMessage('Please provide Resend API key and admin email.');
      return;
    }

    setConnectionStatus(prev => ({ ...prev, email: 'testing' }));

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: config.resendApiKey,
          fromEmail: config.resendFromEmail,
          toEmail: config.adminEmail
        }),
      });

      const result = await response.json();

      if (result.success) {
        setConnectionStatus(prev => ({ ...prev, email: 'success' }));
        setMessage('✅ Email system test successful!');
      } else {
        setConnectionStatus(prev => ({ ...prev, email: 'error' }));
        setMessage(`❌ Email test failed: ${result.error}`);
      }
    } catch (error: any) {
      setConnectionStatus(prev => ({ ...prev, email: 'error' }));
      setMessage(`❌ Email test failed: ${error.message}`);
    }
  };

  const testAllConnections = async () => {
    setConnectionStatus(prev => ({ ...prev, overall: 'testing' }));
    setMessage('Testing all connections...');

    await testSupabaseConnection();
    await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay
    await testEmailConnection();

    // Check if both passed
    setTimeout(() => {
      if (connectionStatus.supabase === 'success' && connectionStatus.email === 'success') {
        setConnectionStatus(prev => ({ ...prev, overall: 'success' }));
        setMessage('🎉 All systems ready for deployment!');
      } else {
        setConnectionStatus(prev => ({ ...prev, overall: 'error' }));
        setMessage('❌ Some connections failed. Please check the configuration.');
      }
    }, 1000);
  };

  const saveConfiguration = async () => {
    setIsLoading(true);
    
    try {
      // Save to localStorage
      localStorage.setItem('deployment_supabase_url', config.supabaseUrl);
      localStorage.setItem('deployment_supabase_key', config.supabaseAnonKey);
      localStorage.setItem('deployment_resend_key', config.resendApiKey);
      localStorage.setItem('deployment_from_email', config.resendFromEmail);
      localStorage.setItem('deployment_admin_email', config.adminEmail);
      localStorage.setItem('deployment_base_url', config.baseUrl);

      // Try to update runtime environment (this will work for development)
      try {
        const response = await fetch('/api/update-env', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            NEXT_PUBLIC_SUPABASE_URL: config.supabaseUrl,
            NEXT_PUBLIC_SUPABASE_ANON_KEY: config.supabaseAnonKey,
            RESEND_API_KEY: config.resendApiKey,
            RESEND_FROM_EMAIL: config.resendFromEmail,
            ADMIN_EMAIL: config.adminEmail,
            NEXT_PUBLIC_BASE_URL: config.baseUrl
          }),
        });

        if (response.ok) {
          setMessage('✅ Configuration saved successfully! Your site is ready for deployment.');
        } else {
          throw new Error('Runtime environment update failed');
        }
      } catch {
        setMessage('✅ Configuration saved locally. For production deployment, add these to your hosting platform.');
      }
    } catch (error: any) {
      setMessage(`❌ Failed to save configuration: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const generateNetlifyEnvVars = () => {
    const envVars = `NEXT_PUBLIC_SUPABASE_URL=${config.supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${config.supabaseAnonKey}
RESEND_API_KEY=${config.resendApiKey}
RESEND_FROM_EMAIL=${config.resendFromEmail}
ADMIN_EMAIL=${config.adminEmail}
NEXT_PUBLIC_BASE_URL=${config.baseUrl}`;

    copyToClipboard(envVars, 'Environment variables');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Cloud className="h-6 w-6 text-blue-600" />
          Deployment Configuration
        </h1>
        <p className="text-gray-600 mt-2">Configure all environment variables for production deployment</p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className={`p-4 rounded-lg border ${
          connectionStatus.supabase === 'success' ? 'bg-green-50 border-green-200' :
          connectionStatus.supabase === 'error' ? 'bg-red-50 border-red-200' :
          connectionStatus.supabase === 'testing' ? 'bg-yellow-50 border-yellow-200' :
          'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="font-medium">Database</span>
            {connectionStatus.supabase === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
            {connectionStatus.supabase === 'error' && <AlertCircle className="h-5 w-5 text-red-600" />}
            {connectionStatus.supabase === 'testing' && <RefreshCw className="h-5 w-5 text-yellow-600 animate-spin" />}
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${
          connectionStatus.email === 'success' ? 'bg-green-50 border-green-200' :
          connectionStatus.email === 'error' ? 'bg-red-50 border-red-200' :
          connectionStatus.email === 'testing' ? 'bg-yellow-50 border-yellow-200' :
          'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="font-medium">Email System</span>
            {connectionStatus.email === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
            {connectionStatus.email === 'error' && <AlertCircle className="h-5 w-5 text-red-600" />}
            {connectionStatus.email === 'testing' && <RefreshCw className="h-5 w-5 text-yellow-600 animate-spin" />}
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${
          connectionStatus.overall === 'success' ? 'bg-green-50 border-green-200' :
          connectionStatus.overall === 'error' ? 'bg-red-50 border-red-200' :
          connectionStatus.overall === 'testing' ? 'bg-yellow-50 border-yellow-200' :
          'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="font-medium">Ready to Deploy</span>
            {connectionStatus.overall === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
            {connectionStatus.overall === 'error' && <AlertCircle className="h-5 w-5 text-red-600" />}
            {connectionStatus.overall === 'testing' && <RefreshCw className="h-5 w-5 text-yellow-600 animate-spin" />}
          </div>
        </div>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.includes('✅') || message.includes('🎉') ? 'bg-green-50 border border-green-200 text-green-800' :
          message.includes('❌') ? 'bg-red-50 border border-red-200 text-red-800' :
          'bg-blue-50 border border-blue-200 text-blue-800'
        }`}>
          {message}
        </div>
      )}

      <div className="space-y-8">
        {/* Supabase Configuration */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-600" />
            Supabase Database Configuration
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supabase Project URL
              </label>
              <input
                type="url"
                value={config.supabaseUrl}
                onChange={(e) => handleInputChange('supabaseUrl', e.target.value)}
                placeholder="https://your-project.supabase.co"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supabase Anon Key
              </label>
              <div className="relative">
                <input
                  type={showKeys.supabaseAnonKey ? 'text' : 'password'}
                  value={config.supabaseAnonKey}
                  onChange={(e) => handleInputChange('supabaseAnonKey', e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-1">
                  <button
                    type="button"
                    onClick={() => toggleKeyVisibility('supabaseAnonKey')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showKeys.supabaseAnonKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(config.supabaseAnonKey, 'Supabase key')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={testSupabaseConnection}
              disabled={!config.supabaseUrl || !config.supabaseAnonKey}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${connectionStatus.supabase === 'testing' ? 'animate-spin' : ''}`} />
              Test Database Connection
            </button>
          </div>
        </div>

        {/* Email Configuration */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5 text-green-600" />
            Email System Configuration
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resend API Key
              </label>
              <div className="relative">
                <input
                  type={showKeys.resendApiKey ? 'text' : 'password'}
                  value={config.resendApiKey}
                  onChange={(e) => handleInputChange('resendApiKey', e.target.value)}
                  placeholder="re_..."
                  className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-1">
                  <button
                    type="button"
                    onClick={() => toggleKeyVisibility('resendApiKey')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showKeys.resendApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(config.resendApiKey, 'Resend API key')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Email Address
                </label>
                <input
                  type="email"
                  value={config.resendFromEmail}
                  onChange={(e) => handleInputChange('resendFromEmail', e.target.value)}
                  placeholder="onboarding@resend.dev"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Email Address
                </label>
                <input
                  type="email"
                  value={config.adminEmail}
                  onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                  placeholder="admin@yourdomain.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              onClick={testEmailConnection}
              disabled={!config.resendApiKey || !config.adminEmail}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${connectionStatus.email === 'testing' ? 'animate-spin' : ''}`} />
              Test Email System
            </button>
          </div>
        </div>

        {/* Application Configuration */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Configuration</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Production Base URL
            </label>
            <input
              type="url"
              value={config.baseUrl}
              onChange={(e) => handleInputChange('baseUrl', e.target.value)}
              placeholder="https://your-site.netlify.app"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              This will be your Netlify site URL after deployment
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Deployment Actions</h3>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={testAllConnections}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${connectionStatus.overall === 'testing' ? 'animate-spin' : ''}`} />
              Test All Connections
            </button>

            <button
              onClick={saveConfiguration}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Configuration'}
            </button>

            <button
              onClick={generateNetlifyEnvVars}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy for Netlify
            </button>

            <a
              href="https://app.netlify.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Netlify Dashboard
            </a>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Deployment Instructions</h3>
          <div className="space-y-3 text-sm text-blue-800">
            <div>
              <strong>1. Test Configuration:</strong> Use "Test All Connections" to verify everything works
            </div>
            <div>
              <strong>2. Save Settings:</strong> Click "Save Configuration" to store your settings
            </div>
            <div>
              <strong>3. Copy Variables:</strong> Use "Copy for Netlify" to copy all environment variables
            </div>
            <div>
              <strong>4. Deploy to Netlify:</strong> Add the copied variables to your Netlify site's environment settings
            </div>
            <div>
              <strong>5. Redeploy:</strong> Trigger a new deployment for the changes to take effect
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
