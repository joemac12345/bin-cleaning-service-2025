'use client';

import { useState } from 'react';
import { 
  serviceReminderTemplate,
  serviceCompletionTemplate,
  paymentReminderTemplate,
  cancellationTemplate,
  abandonedBookingTemplate,
  EmailTemplateData
} from '@/lib/emailTemplates';
import { 
  createBookingConfirmationEmail, 
  createAdminNotificationEmail 
} from '@/lib/email-templates';
import { Send, Mail } from 'lucide-react';

export default function EmailPreviewPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('booking-confirmation');
  const [testEmail, setTestEmail] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendStatus, setSendStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Sample data for preview
  const sampleData: EmailTemplateData = {
    customerName: 'John Smith',
    customerEmail: 'john.smith@example.com',
    bookingId: 'BIN-2024-001',
    serviceType: 'regular',
    collectionDay: 'Monday',
    address: '123 Main Street',
    postcode: 'M1 1AA',
    totalPrice: 25.00,
    specialInstructions: 'Please clean both wheelie bins'
  };

  // Sample data with additional fields for new templates
  const newTemplateData = {
    customerName: 'John Smith',
    customerEmail: 'john.smith@example.com',
    bookingId: 'BIN-2024-001',
    serviceType: 'Wheelie Bin Cleaning',
    address: '123 Main Street',
    postcode: 'M1 1AA',
    phone: '07123 456789',
    contactPermission: 'yes'
  };

  const templates = {
    // ACTIVE TEMPLATES (currently being sent)
    'booking-confirmation': {
      name: 'Booking Confirmation',
      html: createBookingConfirmationEmail(newTemplateData),
      status: 'active',
      subject: 'Booking Confirmation - Bin Cleaning Service'
    },
    'admin-notification': {
      name: 'Admin Notification',
      html: createAdminNotificationEmail(newTemplateData),
      status: 'active',
      subject: 'New Booking Received'
    },
    'abandoned-booking': {
      name: 'Abandoned Booking Recovery',
      html: abandonedBookingTemplate(sampleData),
      status: 'active',
      subject: 'Complete Your Bin Cleaning Booking'
    },
    'service-reminder': {
      name: 'Service Reminder',
      html: serviceReminderTemplate(sampleData),
      status: 'active',
      subject: 'Service Reminder - Bin Cleaning'
    },
    'service-completion': {
      name: 'Service Completion',
      html: serviceCompletionTemplate(sampleData),
      status: 'active',
      subject: 'Service Completed - Bin Cleaning'
    },
    'payment-reminder': {
      name: 'Payment Reminder',
      html: paymentReminderTemplate(sampleData),
      status: 'active',
      subject: 'Payment Reminder - Bin Cleaning Service'
    },
    'cancellation': {
      name: 'Cancellation',
      html: cancellationTemplate(sampleData),
      status: 'active',
      subject: 'Booking Cancellation Confirmation'
    }
  };

  const handleSendTestEmail = async () => {
    if (!testEmail) {
      setSendStatus({ type: 'error', message: 'Please enter an email address' });
      return;
    }

    setIsSending(true);
    setSendStatus({ type: null, message: '' });

    try {
      const currentTemplate = templates[selectedTemplate as keyof typeof templates];
      
      // For preview templates, send the HTML directly
      // For active templates with specific API endpoints, use those
      if (selectedTemplate.startsWith('service-') || selectedTemplate.startsWith('payment-') || selectedTemplate.startsWith('cancellation') || selectedTemplate === 'abandoned-booking') {
        // Send HTML directly for preview templates
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'preview',
            to: testEmail,
            subject: currentTemplate.subject,
            html: currentTemplate.html,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setSendStatus({ 
            type: 'success', 
            message: `Test email sent successfully to ${testEmail}! Check your inbox.` 
          });
          setTimeout(() => setSendStatus({ type: null, message: '' }), 5000);
        } else {
          setSendStatus({ 
            type: 'error', 
            message: data.error || 'Failed to send test email. Please try again.' 
          });
        }
      } else {
        // Use existing API for booking confirmation and admin notification
        let apiType = 'booking-confirmation';
        if (selectedTemplate === 'admin-notification') {
          apiType = 'admin-notification';
        }
        
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: apiType,
            customerName: newTemplateData.customerName,
            customerEmail: testEmail,
            bookingId: newTemplateData.bookingId,
            serviceType: newTemplateData.serviceType,
            address: newTemplateData.address,
            postcode: newTemplateData.postcode,
            phone: newTemplateData.phone,
            contactPermission: newTemplateData.contactPermission,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setSendStatus({ 
            type: 'success', 
            message: `Test email sent successfully to ${testEmail}! Check your inbox.` 
          });
          setTimeout(() => setSendStatus({ type: null, message: '' }), 5000);
        } else {
          setSendStatus({ 
            type: 'error', 
            message: data.error || 'Failed to send test email. Please try again.' 
          });
        }
      }
    } catch (error) {
      setSendStatus({ 
        type: 'error', 
        message: 'Network error. Please check your connection and try again.' 
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Email Template Preview</h1>
          <p className="text-zinc-400">Select a template from the bottom menu to preview</p>
        </div>

        {/* Email Preview */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">
              {templates[selectedTemplate as keyof typeof templates].name}
            </h2>
          </div>
          
          <div className="w-full">
            <div dangerouslySetInnerHTML={{ __html: templates[selectedTemplate as keyof typeof templates].html }} />
          </div>
        </div>
      </div>

      {/* Test Email Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-800 rounded-lg border border-zinc-700 max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 mt-1">
                <Mail className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">Send Test Email</h3>
                <p className="text-sm text-zinc-400">
                  Enter your email address to receive a test version of this template on your mobile device
                </p>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSendStatus({ type: null, message: '' });
                }}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-600 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isSending}
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Template
                </label>
                <div className="px-4 py-3 bg-zinc-900 border border-zinc-600 rounded-lg text-white">
                  {templates[selectedTemplate as keyof typeof templates].name}
                </div>
              </div>

              {sendStatus.type && (
                <div className={`p-3 rounded-lg text-sm ${
                  sendStatus.type === 'success' 
                    ? 'bg-green-900/30 text-green-300 border border-green-700' 
                    : 'bg-red-900/30 text-red-300 border border-red-700'
                }`}>
                  {sendStatus.message}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setSendStatus({ type: null, message: '' });
                  }}
                  className="flex-1 px-4 py-3 bg-zinc-700 hover:bg-zinc-600 text-white font-medium rounded-lg transition-colors"
                  disabled={isSending}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendTestEmail}
                  disabled={isSending || !testEmail}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {isSending ? 'Sending...' : 'Send Test'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation Menu */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Template Selector */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">
              Select Email Template
            </label>
            <div className="relative">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
                {Object.entries(templates).map(([key, template]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedTemplate(key)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm whitespace-nowrap flex-shrink-0 ${
                      selectedTemplate === key
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                    }`}
                  >
                    {template.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm"
            >
              <Send className="w-4 h-4 mr-2" />
              Send Test Email
            </button>
            <div className="text-xs text-zinc-500">
              {Object.values(templates).length} email templates
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
