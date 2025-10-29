import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Email Settings | Admin',
  description: 'Configure email notification system',
};

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-black to-zinc-800 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-white">Email Notification System</h1>
          <p className="text-zinc-300 mt-2">Configure Gmail SMTP for automatic booking confirmations</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Current Status */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200">Email System Status</h3>
                <p className="text-blue-800 dark:text-blue-300 mt-2">
                  The email notification system is installed and ready to configure. Customers will automatically receive 
                  professional booking confirmations when they complete a booking.
                </p>
                <div className="bg-white dark:bg-blue-900/30 rounded-md p-4 mt-4">
                  <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">✅ What's Already Set Up:</h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                    <li>• Nodemailer email service integrated</li>
                    <li>• Professional HTML email template</li>
                    <li>• Automatic sending after booking creation</li>
                    <li>• Mobile-responsive email design</li>
                    <li>• Error handling (booking succeeds even if email fails)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Gmail Setup Instructions */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Gmail SMTP Configuration</h3>
          
          <div className="prose max-w-none">
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Setup Required</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    To enable email notifications, you need to configure Gmail SMTP settings.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900">Step 1: Enable Gmail App Password</h4>
                <ol className="list-decimal list-inside mt-2 space-y-2 text-sm text-gray-600">
                  <li>Go to <a href="https://myaccount.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">Google Account Settings</a></li>
                  <li>Navigate to "Security" in the left sidebar</li>
                  <li>Enable "2-Step Verification" (if not already enabled)</li>
                  <li>Go to "App passwords" section</li>
                  <li>Generate new app password for "Mail" → "Other" → "Bin Cleaning Service"</li>
                  <li>Copy the generated 16-character password</li>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900">Step 2: Configure Environment Variables</h4>
                <p className="text-sm text-gray-600 mt-2 mb-3">
                  Edit the <code className="bg-gray-100 px-1 rounded">.env.local</code> file in your project root:
                </p>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-md text-sm font-mono overflow-x-auto">
                  <div className="text-green-400"># Gmail SMTP Configuration</div>
                  <div>GMAIL_EMAIL=your-actual-gmail@gmail.com</div>
                  <div>GMAIL_APP_PASSWORD=your-16-character-app-password</div>
                  <div className="mt-2 text-green-400"># Company Details</div>
                  <div>COMPANY_NAME=Your Bin Cleaning Service</div>
                  <div>COMPANY_EMAIL=support@yourdomain.com</div>
                  <div>COMPANY_PHONE=+44 123 456 7890</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900">Step 3: Test Email System</h4>
                <ol className="list-decimal list-inside mt-2 space-y-2 text-sm text-gray-600">
                  <li>Restart your development server: <code className="bg-gray-100 px-1 rounded">npm run dev</code></li>
                  <li>Create a test booking through the customer form</li>
                  <li>Check the terminal for email sending logs</li>
                  <li>Verify the confirmation email in the customer's inbox</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Email Template Preview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Template Features</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">📧 Email Content Includes:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Personalized customer greeting</li>
                <li>• Booking ID and confirmation status</li>
                <li>• Service details (type, collection day)</li>
                <li>• Number of bins and total cost</li>
                <li>• Service address</li>
                <li>• Next steps and expectations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">🎨 Professional Design:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Mobile-responsive HTML template</li>
                <li>• Company branding and colors</li>
                <li>• Clean, modern layout</li>
                <li>• Contact information footer</li>
                <li>• Professional email formatting</li>
                <li>• Cross-platform compatibility</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <Link 
              href="/admin/bookings"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View Bookings
            </Link>
            <a 
              href="https://myaccount.google.com/apppasswords" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Generate App Password
            </a>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
