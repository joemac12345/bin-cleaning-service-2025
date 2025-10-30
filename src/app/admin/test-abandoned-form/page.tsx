'use client';

import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';

export default function TestAbandonedFormPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [postcode, setPostcode] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const saveAbandonedForm = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/abandoned-forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData: {
            formData: {
              firstName,
              lastName,
              email,
              phone,
              binQuantities: {
                wheelie: 1,
                recycling: 0,
                food: 0,
                garden: 0
              },
              serviceType: 'regular',
              paymentMethod: 'card',
            },
            postcode,
            currentStep: 3
          },
          pageUrl: window.location.href,
          userAgent: navigator.userAgent,
          trackingId: `test-${Date.now()}`
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        if (result.skipped) {
          setMessage('⏭️ Form not saved - no contact details provided');
        } else {
          setMessage(`✅ Abandoned form saved successfully! Form ID: ${result.formId}`);
        }
      } else {
        setMessage(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setPostcode('');
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Test Abandoned Forms
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Fill out some fields (at least one contact detail) and click "Save as Abandoned" to test the abandoned forms feature.
          </p>

          {/* Success/Error Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.includes('✅') ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300' :
              message.includes('⏭️') ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300' :
              'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
            }`}>
              {message}
            </div>
          )}

          <div className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:text-white"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:text-white"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="07123456789"
                className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:text-white"
              />
            </div>

            {/* Postcode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Postcode
              </label>
              <input
                type="text"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                placeholder="SW1A 1AA"
                className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:text-white"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4">
            <button
              onClick={saveAbandonedForm}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Save as Abandoned</span>
                </>
              )}
            </button>
            <button
              onClick={clearForm}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
            >
              Clear
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Testing Instructions:</h3>
            <ol className="text-sm text-blue-800 dark:text-blue-400 space-y-2 list-decimal list-inside">
              <li>Fill in at least ONE contact field (name, email, or phone)</li>
              <li>Click "Save as Abandoned" button</li>
              <li>Go to <a href="/admin/abandoned-forms-analytics" className="underline font-medium">Abandoned Forms Analytics</a></li>
              <li>You should see your test entry appear!</li>
              <li>Test with NO contact details to verify filtering works</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
