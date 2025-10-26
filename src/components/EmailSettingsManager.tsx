'use client';

import { useState, useEffect } from 'react';
import { Mail, Save, Eye, EyeOff, CheckCircle, AlertCircle, Settings, User, MapPin, Phone, Clock, Truck, CheckCircle2, XCircle, Play } from 'lucide-react';

export default function EmailSettingsManager() {
  const [settings, setSettings] = useState({
    gmailEmail: '',
    gmailAppPassword: '',
    companyName: '',
    companyEmail: '',
    companyPhone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);
  const [testStatus, setTestStatus] = useState<'success' | 'error' | null>(null);

  // Load existing settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/admin/email-settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to load email settings:', error);
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    
    try {
      const response = await fetch('/api/admin/email-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Failed to save email settings:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const testEmailSettings = async () => {
    setIsTesting(true);
    setTestStatus(null);
    
    try {
      const response = await fetch('/api/admin/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testEmail: settings.gmailEmail,
        }),
      });

      if (response.ok) {
        setTestStatus('success');
      } else {
        throw new Error('Email test failed');
      }
    } catch (error) {
      console.error('Email test failed:', error);
      setTestStatus('error');
    } finally {
      setIsTesting(false);
      setTimeout(() => setTestStatus(null), 5000);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="border-b pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Email Settings</h1>
              <p className="text-gray-600">Configure Gmail SMTP settings for booking notifications</p>
            </div>
          </div>
        </div>

        {/* Gmail SMTP Settings */}
        <div className="border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Gmail SMTP Configuration
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gmail Email Address
              </label>
              <input
                type="email"
                value={settings.gmailEmail}
                onChange={(e) => setSettings({...settings, gmailEmail: e.target.value})}
                placeholder="your-email@gmail.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gmail App Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={settings.gmailAppPassword}
                  onChange={(e) => setSettings({...settings, gmailAppPassword: e.target.value})}
                  placeholder="16-character app password"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Generate this from{' '}
                <a
                  href="https://myaccount.google.com/security"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Google Account Security
                </a>
                {' '}→ App passwords
              </p>
            </div>
          </div>
        </div>

        {/* Company Details */}
        <div className="border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Company Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => setSettings({...settings, companyName: e.target.value})}
                placeholder="Your Bin Cleaning Service"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Email
              </label>
              <input
                type="email"
                value={settings.companyEmail}
                onChange={(e) => setSettings({...settings, companyEmail: e.target.value})}
                placeholder="support@yourdomain.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Phone
              </label>
              <input
                type="tel"
                value={settings.companyPhone}
                onChange={(e) => setSettings({...settings, companyPhone: e.target.value})}
                placeholder="+44 123 456 7890"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={saveSettings}
            disabled={isSaving}
            className="flex-1 sm:flex-none px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Settings</span>
              </>
            )}
          </button>
          
          <button
            onClick={testEmailSettings}
            disabled={isTesting || !settings.gmailEmail || !settings.gmailAppPassword}
            className="flex-1 sm:flex-none px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isTesting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Testing...</span>
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                <span>Test Email</span>
              </>
            )}
          </button>
        </div>

        {/* Status Messages */}
        {saveStatus && (
          <div className={`p-4 rounded-lg flex items-center space-x-2 ${
            saveStatus === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {saveStatus === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>
              {saveStatus === 'success' 
                ? 'Email settings saved successfully!' 
                : 'Failed to save email settings. Please try again.'
              }
            </span>
          </div>
        )}

        {testStatus && (
          <div className={`p-4 rounded-lg flex items-center space-x-2 ${
            testStatus === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {testStatus === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>
              {testStatus === 'success' 
                ? 'Test email sent successfully! Check your inbox.' 
                : 'Email test failed. Please check your credentials and try again.'
              }
            </span>
          </div>
        )}

        {/* Email Preview Cards */}
        <div className="border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Email Preview</h2>
          <p className="text-sm text-gray-600 mb-6">Preview the different types of emails that will be sent automatically:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Booking Confirmation Email */}
            <div className="border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Booking Confirmation</h3>
              </div>
              <p className="text-xs text-gray-600 mb-3">
                Sent to customers immediately after booking completion
              </p>
              <div className="bg-white rounded border p-3 text-xs">
                <div className="font-semibold text-blue-900 mb-1">Subject:</div>
                <div className="text-gray-700 mb-2">Booking Confirmation - BC-123456</div>
                <div className="font-semibold text-blue-900 mb-1">Content:</div>
                <div className="text-gray-700 text-xs leading-relaxed space-y-1">
                  <div className="flex items-center"><CheckCircle2 className="w-3 h-3 mr-1 text-green-600" /> Professional HTML template</div>
                  <div className="flex items-center"><Mail className="w-3 h-3 mr-1 text-blue-600" /> Complete booking details</div>
                  <div className="flex items-center"><MapPin className="w-3 h-3 mr-1 text-red-600" /> Service address & schedule</div>
                  <div className="flex items-center"><Save className="w-3 h-3 mr-1 text-green-600" /> Pricing breakdown</div>
                  <div className="flex items-center"><Phone className="w-3 h-3 mr-1 text-purple-600" /> Company contact info</div>
                  <div className="flex items-center"><Settings className="w-3 h-3 mr-1 text-gray-600" /> Mobile-responsive design</div>
                </div>
              </div>
            </div>

            {/* Status Update Emails */}
            <div className="border rounded-lg p-4 bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                  <Settings className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Status Updates</h3>
              </div>
              <p className="text-xs text-gray-600 mb-3">
                Sent when you change booking status in admin panel
              </p>
              <div className="bg-white rounded border p-3 text-xs space-y-2">
                <div className="flex items-center">
                  <CheckCircle className="w-3 h-3 mr-2 text-green-600" />
                  <span className="font-semibold text-green-700">Confirmed:</span>
                  <span className="text-gray-600 ml-1">"Booking Confirmed!"</span>
                </div>
                <div className="flex items-center">
                  <Truck className="w-3 h-3 mr-2 text-blue-600" />
                  <span className="font-semibold text-blue-700">In Progress:</span>
                  <span className="text-gray-600 ml-1">"Service In Progress"</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-2 text-purple-600" />
                  <span className="font-semibold text-purple-700">Completed:</span>
                  <span className="text-gray-600 ml-1">"Service Completed!"</span>
                </div>
                <div className="flex items-center">
                  <XCircle className="w-3 h-3 mr-2 text-red-600" />
                  <span className="font-semibold text-red-700">Cancelled:</span>
                  <span className="text-gray-600 ml-1">"Booking Cancelled"</span>
                </div>
              </div>
            </div>

            {/* Admin Notification Email */}
            <div className="border rounded-lg p-4 bg-gradient-to-br from-orange-50 to-amber-50">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center mr-3">
                  <AlertCircle className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Admin Alerts</h3>
              </div>
              <p className="text-xs text-gray-600 mb-3">
                Sent to admin email for every new booking
              </p>
              <div className="bg-white rounded border p-3 text-xs">
                <div className="font-semibold text-orange-900 mb-1">Subject:</div>
                <div className="text-gray-700 mb-2 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1 text-red-600" />
                  New Booking: BC-123456 - £15.00
                </div>
                <div className="font-semibold text-orange-900 mb-1">Content:</div>
                <div className="text-gray-700 text-xs leading-relaxed space-y-1">
                  <div className="flex items-center"><AlertCircle className="w-3 h-3 mr-1 text-red-600" /> Urgent new booking alert</div>
                  <div className="flex items-center"><User className="w-3 h-3 mr-1 text-blue-600" /> Customer contact details</div>
                  <div className="flex items-center"><Mail className="w-3 h-3 mr-1 text-green-600" /> Full booking information</div>
                  <div className="flex items-center"><Save className="w-3 h-3 mr-1 text-green-600" /> Total booking value</div>
                  <div className="flex items-center"><Settings className="w-3 h-3 mr-1 text-purple-600" /> Direct admin panel link</div>
                  <div className="flex items-center"><Mail className="w-3 h-3 mr-1 text-gray-600" /> Sent to: {settings.gmailEmail || 'your-email@gmail.com'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Email Flow Diagram */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Email Flow</h3>
            <div className="flex items-center justify-between text-sm">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="mt-1 text-center text-xs">Customer<br/>Books Service</span>
              </div>
              <div className="flex-1 h-px bg-gray-300 mx-2"></div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="mt-1 text-center text-xs">Confirmation<br/>to Customer</span>
              </div>
              <div className="flex-1 h-px bg-gray-300 mx-2"></div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-white" />
                </div>
                <span className="mt-1 text-center text-xs">Alert<br/>to Admin</span>
              </div>
              <div className="flex-1 h-px bg-gray-300 mx-2"></div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <Settings className="w-4 h-4 text-white" />
                </div>
                <span className="mt-1 text-center text-xs">Status Updates<br/>to Customer</span>
              </div>
            </div>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="border rounded-lg p-6 bg-blue-50">
          <h3 className="font-semibold text-blue-900 mb-3">Gmail App Password Setup</h3>
          <ol className="space-y-2 text-sm text-blue-800">
            <li>
              1. Go to your{' '}
              <a
                href="https://myaccount.google.com/security"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:text-blue-900 underline font-medium"
              >
                Google Account Security page
              </a>
            </li>
            <li>2. Navigate to Security (left sidebar)</li>
            <li>3. Enable 2-Step Verification (if not already enabled)</li>
            <li>4. Go to "App passwords" section</li>
            <li>5. Select "Mail" as the app and "Other" as the device</li>
            <li>6. Name it "Bin Cleaning Service" and generate the password</li>
            <li>7. Copy the 16-character password and paste it above</li>
          </ol>
          
          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>Quick Access:</strong>{' '}
              <a
                href="https://myaccount.google.com/apppasswords"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:text-blue-900 underline font-medium"
              >
                Direct link to App Passwords
              </a>
              {' '}(requires 2-Step Verification to be enabled first)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
