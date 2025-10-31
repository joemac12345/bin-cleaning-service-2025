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
  const [selectedTemplate, setSelectedTemplate] = useState<string>('active-booking-confirmation');
  const [testEmail, setTestEmail] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendStatus, setSendStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

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
    'active-booking-confirmation': {
      name: '✅ ACTIVE: Booking Confirmation',
      html: createBookingConfirmationEmail(newTemplateData),
      status: 'active',
      subject: 'Booking Confirmation - Bin Cleaning Service'
    },
    'active-admin-notification': {
      name: '✅ ACTIVE: Admin Notification',
      html: createAdminNotificationEmail(newTemplateData),
      status: 'active',
      subject: 'New Booking Received'
    },
    'active-abandoned-booking': {
      name: '✅ ACTIVE: Abandoned Booking Recovery',
      html: abandonedBookingTemplate(sampleData),
      status: 'active',
      subject: 'Complete Your Bin Cleaning Booking'
    },
    
    // OLD/UNUSED TEMPLATES (not currently being sent)
    'old-service-reminder': {
      name: '⚠️ OLD: Service Reminder',
      html: serviceReminderTemplate(sampleData),
      status: 'old',
      subject: 'Service Reminder - Bin Cleaning'
    },
    'old-service-completion': {
      name: '⚠️ OLD: Service Completion',
      html: serviceCompletionTemplate(sampleData),
      status: 'old',
      subject: 'Service Completed - Bin Cleaning'
    },
    'old-payment-reminder': {
      name: '⚠️ OLD: Payment Reminder',
      html: paymentReminderTemplate(sampleData),
      status: 'old',
      subject: 'Payment Reminder - Bin Cleaning Service'
    },
    'old-cancellation': {
      name: '⚠️ OLD: Cancellation',
      html: cancellationTemplate(sampleData),
      status: 'old',
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
      
      // For preview-only templates (OLD templates), send the HTML directly via a generic endpoint
      // For active templates, use the proper API type
      if (selectedTemplate.startsWith('old-') || selectedTemplate === 'active-abandoned-booking') {
        // Send HTML directly for old/preview templates
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
        // Use existing API for active templates
        let apiType = 'booking-confirmation';
        if (selectedTemplate === 'active-admin-notification') {
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
          
          {/* Test Email Section */}
          <div className="mb-6 bg-zinc-800 rounded-lg p-6 border border-zinc-700">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <Mail className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">Send Test Email</h3>
                <p className="text-sm text-zinc-400 mb-4">
                  Enter your email address to receive a test version of this template on your mobile device
                </p>
                
                <div className="flex gap-3">
                  <input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="flex-1 px-4 py-2 bg-zinc-900 border border-zinc-600 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isSending}
                  />
                  <button
                    onClick={handleSendTestEmail}
                    disabled={isSending || !testEmail}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {isSending ? 'Sending...' : 'Send Test'}
                  </button>
                </div>
                
                {sendStatus.type && (
                  <div className={`mt-3 p-3 rounded-lg text-sm ${
                    sendStatus.type === 'success' 
                      ? 'bg-green-900/30 text-green-300 border border-green-700' 
                      : 'bg-red-900/30 text-red-300 border border-red-700'
                  }`}>
                    {sendStatus.message}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="w-full">
            <div dangerouslySetInnerHTML={{ __html: templates[selectedTemplate as keyof typeof templates].html }} />
          </div>
        </div>
      </div>

      {/* Bottom Navigation Menu */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Template Selector */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">
              Select Email Template
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(templates).map(([key, template]) => (
                <button
                  key={key}
                  onClick={() => setSelectedTemplate(key)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                    selectedTemplate === key
                      ? template.status === 'active'
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-amber-600 text-white hover:bg-amber-700'
                      : template.status === 'active'
                        ? 'bg-green-900/30 text-green-300 hover:bg-green-900/50 border border-green-700'
                        : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                  }`}
                >
                  {template.name}
                </button>
              ))}
            </div>
            <p className="text-xs text-zinc-500 mt-2">
              <span className="text-green-400">✅ Active</span> = Currently being sent to customers | 
              <span className="text-amber-400 ml-2">⚠️ Old</span> = Not currently in use
            </p>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
            <div className="flex items-center gap-3">
              <a
                href="/admin"
                className="inline-flex items-center px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium rounded-lg transition-colors border border-zinc-700 text-sm"
              >
                ← Back to Admin
              </a>
              <button
                onClick={() => {
                  const blob = new Blob([templates[selectedTemplate as keyof typeof templates].html], { type: 'text/html' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${selectedTemplate}-template.html`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors text-sm"
              >
                Download HTML
              </button>
            </div>
            <div className="text-xs text-zinc-500">
              {Object.values(templates).filter((t: any) => t.status === 'active').length} active • {Object.values(templates).filter((t: any) => t.status === 'old').length} old templates
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
