'use client';

import { useState } from 'react';
import { Mail, X } from 'lucide-react';

const EMAIL_TEMPLATES = [
  {
    id: 'booking-confirmation',
    label: '📋 Booking Confirmation',
    description: 'Confirm booking details to customer',
  },
  {
    id: 'service-reminder',
    label: '🔔 Service Reminder',
    description: 'Remind customer about upcoming service',
  },
  {
    id: 'service-completion',
    label: '✓ Service Completion',
    description: 'Confirm service has been completed',
  },
  {
    id: 'payment-reminder',
    label: '💳 Payment Reminder',
    description: 'Remind customer about pending payment',
  },
  {
    id: 'cancellation',
    label: '✕ Cancellation',
    description: 'Confirm booking cancellation',
  },
];

interface SendEmailModalProps {
  customerEmail: string;
  customerName: string;
  bookingId: string;
  onSend: (templateId: string, customMessage: string) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
}

export default function SendEmailModal({
  customerEmail,
  customerName,
  bookingId,
  onSend,
  onClose,
  isLoading = false,
}: SendEmailModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(EMAIL_TEMPLATES[0].id);
  const [customMessage, setCustomMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const selectedTemplateData = EMAIL_TEMPLATES.find(t => t.id === selectedTemplate);

  const handleSend = async () => {
    setIsSending(true);
    try {
      await onSend(selectedTemplate, customMessage);
      setCustomMessage('');
      onClose();
    } catch (error) {
      console.error('Error sending email:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full h-full bg-white dark:bg-zinc-900 rounded-none shadow-none overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-black to-zinc-800 p-6 flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <Mail className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-lg font-bold text-white">Send Email</h2>
              <p className="text-sm text-zinc-300">{customerEmail}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSending}
            className="p-1 hover:bg-zinc-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-6 space-y-4 w-full flex flex-col justify-start">
          {/* Template Selection */}
          <div>
            <label className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
              Choose Email Template
            </label>
            <div className="space-y-2">
              {EMAIL_TEMPLATES.map(template => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                    selectedTemplate === template.id
                      ? 'border-black bg-black/5 dark:border-white dark:bg-white/10'
                      : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                  }`}
                >
                  <div className="font-medium text-zinc-900 dark:text-zinc-100">
                    {template.label}
                  </div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    {template.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Template Preview */}
          {/* Hidden for now - can be re-enabled later if needed
          {selectedTemplateData && (
            <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
              <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide mb-2">
                Preview
              </p>
              <p className="text-sm text-zinc-900 dark:text-zinc-100">
                {selectedTemplateData.description}
              </p>
            </div>
          )}
          */}

          {/* Custom Message */}
          {/* Hidden for now - can be re-enabled later if needed
          <div>
            <label className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              Add Custom Message (Optional)
            </label>
            <textarea
              value={customMessage}
              onChange={e => setCustomMessage(e.target.value.slice(0, 500))}
              maxLength={500}
              placeholder="Add a personal note to the email..."
              className="w-full p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white resize-none"
              rows={3}
            />
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              {customMessage.length}/500 characters
            </p>
          </div>
          */}
        </div>

        {/* Footer */}
        <div className="bg-zinc-50 dark:bg-zinc-800 px-6 py-4 flex justify-end gap-3 border-t border-zinc-200 dark:border-zinc-700 w-full">
          <button
            onClick={onClose}
            disabled={isSending}
            className="px-4 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 font-medium hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={isSending || isLoading}
            className="px-4 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black font-medium hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSending ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              'Send Email'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
