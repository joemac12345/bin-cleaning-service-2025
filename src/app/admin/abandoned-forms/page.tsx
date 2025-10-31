'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Mail, 
  Phone,
  MapPin, 
  Clock,
  RefreshCw,
  Search,
  X,
  CheckCircle,
  AlertCircle,
  Calendar,
  Home,
  Send,
  PhoneCall,
  Eye,
  EyeOff,
  MessageSquare,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';

interface ContactActivity {
  type: 'email' | 'phone' | 'note';
  timestamp: string;
  details: string;
  emailOpened?: boolean;
  template?: string;
}

interface AbandonedForm {
  id: string;
  sessionId: string;
  postcode: string;
  formData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  createdAt: string;
  lastUpdated: string;
  status: 'never_contacted' | 'email_sent' | 'phone_called' | 'multiple_attempts' | 'responded' | 'converted' | 'unqualified';
  completionPercentage: number;
  potentialValue: number;
  contactHistory: ContactActivity[];
  notes?: string;
}

interface Stats {
  total: number;
  never_contacted: number;
  email_sent: number;
  phone_called: number;
  responded: number;
  converted: number;
}

export default function AbandonedFormsPage() {
  const [forms, setForms] = useState<AbandonedForm[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'never_contacted' | 'email_sent' | 'phone_called' | 'responded' | 'converted'>('all');
  const [selectedForm, setSelectedForm] = useState<AbandonedForm | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('abandoned-booking');
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Email templates available
  const emailTemplates = [
    { id: 'abandoned-booking', name: 'Abandoned Booking Recovery', subject: 'Complete Your Bin Cleaning Booking' },
    { id: 'booking-confirmation', name: 'Booking Confirmation', subject: 'Booking Confirmation - Bin Cleaning Service' },
    { id: 'service-reminder', name: 'Service Reminder', subject: 'Service Reminder - Bin Cleaning' },
  ];

  // Fetch abandoned forms
  const fetchForms = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/abandoned-forms');
      const data = await response.json();
      
      if (data.success) {
        const mappedForms = (data.abandonedForms || []).map((form: any) => ({
          ...form,
          status: form.status || 'never_contacted',
          contactHistory: form.contactHistory || []
        }));
        
        setForms(mappedForms);
        
        // Calculate stats
        const statsData = {
          total: mappedForms.length,
          never_contacted: mappedForms.filter((f: any) => f.status === 'never_contacted').length,
          email_sent: mappedForms.filter((f: any) => f.status === 'email_sent').length,
          phone_called: mappedForms.filter((f: any) => f.status === 'phone_called').length,
          responded: mappedForms.filter((f: any) => f.status === 'responded').length,
          converted: mappedForms.filter((f: any) => f.status === 'converted').length,
        };
        setStats(statsData);
      } else {
        console.error('Failed to fetch forms:', data.error);
      }
    } catch (error) {
      console.error('Error fetching forms:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  // Filter forms
  const filteredForms = forms.filter(form => {
    const matchesSearch = 
      (form.formData.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (form.formData.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (form.formData.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (form.postcode?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesFilter = filterStatus === 'all' || form.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    }
  };

  // Status colors and icons
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'never_contacted':
        return 'bg-red-500';
      case 'email_sent':
        return 'bg-blue-500';
      case 'phone_called':
        return 'bg-purple-500';
      case 'multiple_attempts':
        return 'bg-orange-500';
      case 'responded':
        return 'bg-yellow-500';
      case 'converted':
        return 'bg-green-500';
      case 'unqualified':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'never_contacted':
        return <AlertCircle className="w-4 h-4" />;
      case 'email_sent':
        return <Mail className="w-4 h-4" />;
      case 'phone_called':
        return <Phone className="w-4 h-4" />;
      case 'multiple_attempts':
        return <PhoneCall className="w-4 h-4" />;
      case 'responded':
        return <MessageSquare className="w-4 h-4" />;
      case 'converted':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Send email function
  const handleSendEmail = async () => {
    if (!selectedForm || !selectedForm.formData.email) {
      alert('No email address available for this form');
      return;
    }

    setIsSendingEmail(true);
    
    try {
      const template = emailTemplates.find(t => t.id === selectedTemplate);
      
      const response = await fetch('/api/abandoned-forms/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formId: selectedForm.id,
          email: selectedForm.formData.email,
          template: selectedTemplate,
          customerName: `${selectedForm.formData.firstName || ''} ${selectedForm.formData.lastName || ''}`.trim() || 'Customer',
          postcode: selectedForm.postcode,
          formData: selectedForm.formData
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ Email sent successfully!');
        setShowEmailModal(false);
        await fetchForms(); // Refresh to show updated contact history
      } else {
        alert(`❌ Failed to send email: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('❌ Error sending email. Please try again.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Log phone call function
  const handleLogPhoneCall = async (outcome: string, notes: string) => {
    if (!selectedForm) return;

    try {
      const response = await fetch('/api/abandoned-forms/log-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formId: selectedForm.id,
          type: 'phone',
          details: `${outcome}${notes ? ': ' + notes : ''}`,
        }),
      });

      if (response.ok) {
        alert('✅ Phone call logged successfully!');
        setShowPhoneModal(false);
        await fetchForms();
      } else {
        alert('❌ Failed to log phone call');
      }
    } catch (error) {
      console.error('Error logging phone call:', error);
      alert('❌ Error logging phone call');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Link 
                href="/admin"
                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <span className="text-xl">←</span>
              </Link>
              <div>
                <h1 className="text-xl font-semibold">Abandoned Forms</h1>
                <p className="text-sm text-zinc-400">Recovery leads & contact tracking</p>
              </div>
            </div>
            
            <button
              onClick={fetchForms}
              disabled={loading}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-zinc-800/50 px-3 py-2 rounded-lg">
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-xs text-zinc-400">Total</div>
              </div>
              <div className="bg-zinc-800/50 px-3 py-2 rounded-lg">
                <div className="text-2xl font-bold text-red-500">{stats.never_contacted}</div>
                <div className="text-xs text-zinc-400">New</div>
              </div>
              <div className="bg-zinc-800/50 px-3 py-2 rounded-lg">
                <div className="text-2xl font-bold text-green-500">{stats.converted}</div>
                <div className="text-xs text-zinc-400">Converted</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or postcode..."
            className="w-full bg-zinc-800 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-700 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="pb-20">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-zinc-600" />
          </div>
        ) : filteredForms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <Users className="w-12 h-12 text-zinc-700 mb-3" />
            <p className="text-zinc-400 text-center">
              {searchTerm ? 'No results found' : 'No abandoned forms yet'}
            </p>
          </div>
        ) : (
          <div className="px-4 py-4 space-y-3">
            {filteredForms.map((form) => {
              const customerName = `${form.formData.firstName || ''} ${form.formData.lastName || ''}`.trim() || 'Anonymous';
              const hasEmail = !!form.formData.email;
              const hasPhone = !!form.formData.phone;
              const lastContact = form.contactHistory.length > 0 
                ? form.contactHistory[form.contactHistory.length - 1] 
                : null;

              return (
                <div
                  key={form.id}
                  onClick={() => setSelectedForm(form)}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:bg-zinc-800/50 transition-colors cursor-pointer"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white">{customerName}</h3>
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(form.status)}`} />
                      </div>
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(form.createdAt)}</span>
                        {form.completionPercentage > 0 && (
                          <>
                            <span>•</span>
                            <span>{form.completionPercentage}% complete</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(form.status)} bg-opacity-20 flex items-center gap-1`}>
                      {getStatusIcon(form.status)}
                      <span>{getStatusLabel(form.status)}</span>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2">
                    {hasEmail && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                        <span className="text-zinc-300 truncate">{form.formData.email}</span>
                      </div>
                    )}
                    {hasPhone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                        <span className="text-zinc-300">{form.formData.phone}</span>
                      </div>
                    )}
                    {form.postcode && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                        <span className="text-zinc-300">{form.postcode}</span>
                      </div>
                    )}
                  </div>

                  {/* Last Contact */}
                  {lastContact && (
                    <div className="mt-3 pt-3 border-t border-zinc-800">
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        {lastContact.type === 'email' ? <Mail className="w-3 h-3" /> : <Phone className="w-3 h-3" />}
                        <span>Last contact: {formatDate(lastContact.timestamp)}</span>
                        {lastContact.type === 'email' && lastContact.emailOpened && (
                          <span className="flex items-center gap-1 text-green-400">
                            <Eye className="w-3 h-3" />
                            Opened
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Contact Attempts Badge */}
                  {form.contactHistory.length > 0 && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-zinc-500">
                        {form.contactHistory.length} contact{form.contactHistory.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Filter Menu */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 px-2 py-3">
        <div className="flex items-center justify-around">
          <Link
            href="/admin"
            className="flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-colors text-zinc-500 hover:bg-zinc-800 hover:text-white"
          >
            <Home className="w-5 h-5" />
            <span className="text-xs font-medium">Admin</span>
          </Link>

          <button
            onClick={() => setFilterStatus('all')}
            className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-colors ${
              filterStatus === 'all' ? 'bg-zinc-800 text-white' : 'text-zinc-500'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-xs font-medium">All</span>
          </button>

          <button
            onClick={() => setFilterStatus('never_contacted')}
            className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-colors ${
              filterStatus === 'never_contacted' ? 'bg-zinc-800 text-red-500' : 'text-zinc-500'
            }`}
          >
            <AlertCircle className="w-5 h-5" />
            <span className="text-xs font-medium">New</span>
          </button>

          <button
            onClick={() => setFilterStatus('email_sent')}
            className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-colors ${
              filterStatus === 'email_sent' ? 'bg-zinc-800 text-blue-500' : 'text-zinc-500'
            }`}
          >
            <Mail className="w-5 h-5" />
            <span className="text-xs font-medium">Emailed</span>
          </button>

          <button
            onClick={() => setFilterStatus('phone_called')}
            className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-colors ${
              filterStatus === 'phone_called' ? 'bg-zinc-800 text-purple-500' : 'text-zinc-500'
            }`}
          >
            <Phone className="w-5 h-5" />
            <span className="text-xs font-medium">Called</span>
          </button>

          <button
            onClick={() => setFilterStatus('converted')}
            className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-colors ${
              filterStatus === 'converted' ? 'bg-zinc-800 text-green-500' : 'text-zinc-500'
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            <span className="text-xs font-medium">Won</span>
          </button>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedForm && !showEmailModal && !showPhoneModal && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center z-50"
          onClick={() => setSelectedForm(null)}
        >
          <div 
            className="bg-zinc-900 w-full sm:max-w-lg sm:rounded-lg overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-zinc-800 px-4 py-4 flex items-center justify-between sticky top-0 z-10">
              <h2 className="text-lg font-semibold">Form Details</h2>
              <button
                onClick={() => setSelectedForm(null)}
                className="p-2 hover:bg-zinc-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 space-y-4">
              {/* Status */}
              <div>
                <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">Status</label>
                <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${getStatusColor(selectedForm.status)} bg-opacity-20`}>
                  {getStatusIcon(selectedForm.status)}
                  <span className="font-medium">{getStatusLabel(selectedForm.status)}</span>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">Customer</label>
                <div className="bg-zinc-800 px-4 py-3 rounded-lg">
                  <p className="text-white">{`${selectedForm.formData.firstName || ''} ${selectedForm.formData.lastName || ''}`.trim() || 'Anonymous'}</p>
                </div>
              </div>

              {/* Email */}
              {selectedForm.formData.email && (
                <div>
                  <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">Email</label>
                  <div className="bg-zinc-800 px-4 py-3 rounded-lg">
                    <a 
                      href={`mailto:${selectedForm.formData.email}`}
                      className="text-blue-400 hover:text-blue-300 break-all"
                    >
                      {selectedForm.formData.email}
                    </a>
                  </div>
                </div>
              )}

              {/* Phone */}
              {selectedForm.formData.phone && (
                <div>
                  <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">Phone</label>
                  <div className="bg-zinc-800 px-4 py-3 rounded-lg">
                    <a 
                      href={`tel:${selectedForm.formData.phone}`}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      {selectedForm.formData.phone}
                    </a>
                  </div>
                </div>
              )}

              {/* Postcode */}
              {selectedForm.postcode && (
                <div>
                  <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">Postcode</label>
                  <div className="bg-zinc-800 px-4 py-3 rounded-lg">
                    <p className="text-white font-mono">{selectedForm.postcode}</p>
                  </div>
                </div>
              )}

              {/* Potential Value */}
              <div>
                <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">Potential Value</label>
                <div className="bg-zinc-800 px-4 py-3 rounded-lg">
                  <p className="text-white font-semibold">£{selectedForm.potentialValue?.toFixed(2) || '0.00'}</p>
                </div>
              </div>

              {/* Contact History */}
              <div>
                <label className="text-xs text-zinc-500 uppercase tracking-wider mb-2 block">Contact History</label>
                {selectedForm.contactHistory && selectedForm.contactHistory.length > 0 ? (
                  <div className="space-y-2">
                    {selectedForm.contactHistory.map((activity, index) => (
                      <div 
                        key={index} 
                        className={`px-4 py-3 rounded-lg border-l-4 ${
                          activity.type === 'email' 
                            ? 'bg-blue-950/50 border-l-blue-500' 
                            : 'bg-purple-950/50 border-l-purple-500'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-1 ${activity.type === 'email' ? 'text-blue-400' : 'text-purple-400'}`}>
                            {activity.type === 'email' ? <Mail className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-white text-sm font-medium">
                                {activity.type === 'email' ? 'Email Sent' : 'Phone Call'}
                              </span>
                              {activity.type === 'email' && activity.emailOpened && (
                                <span className="flex items-center gap-1 text-xs text-green-400">
                                  <Eye className="w-3 h-3" />
                                  Opened
                                </span>
                              )}
                              {activity.type === 'email' && !activity.emailOpened && (
                                <span className="flex items-center gap-1 text-xs text-zinc-500">
                                  <EyeOff className="w-3 h-3" />
                                  Not opened
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-zinc-300">{activity.details}</p>
                            <p className="text-xs text-zinc-400 mt-1">
                              {new Date(activity.timestamp).toLocaleString('en-GB')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-zinc-800 px-4 py-3 rounded-lg">
                    <p className="text-zinc-600 italic text-sm">No contact history yet</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                <div className="flex gap-2">
                  {selectedForm.formData.email && (
                    <button
                      onClick={() => {
                        setShowEmailModal(true);
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Email
                    </button>
                  )}
                  
                  {selectedForm.formData.phone && (
                    <button
                      onClick={() => {
                        setShowPhoneModal(true);
                      }}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      Call
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedForm(null)}
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && selectedForm && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center z-50"
          onClick={() => setShowEmailModal(false)}
        >
          <div 
            className="bg-zinc-900 w-full sm:max-w-lg sm:rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-zinc-800 px-4 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Send Email</h2>
              <button
                onClick={() => setShowEmailModal(false)}
                className="p-2 hover:bg-zinc-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="text-xs text-zinc-500 uppercase tracking-wider mb-2 block">Select Template</label>
                <div className="space-y-2">
                  {emailTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                        selectedTemplate === template.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                      }`}
                    >
                      <div className="font-medium">{template.name}</div>
                      <div className="text-xs opacity-75 mt-1">{template.subject}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">Sending to</label>
                <div className="bg-zinc-800 px-4 py-3 rounded-lg">
                  <p className="text-white">{selectedForm.formData.email}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 rounded-lg transition-colors"
                  disabled={isSendingEmail}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendEmail}
                  disabled={isSendingEmail}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  {isSendingEmail ? 'Sending...' : 'Send Email'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Phone Call Modal */}
      {showPhoneModal && selectedForm && (
        <PhoneCallModal 
          form={selectedForm}
          onClose={() => setShowPhoneModal(false)}
          onSubmit={handleLogPhoneCall}
        />
      )}
    </div>
  );
}

// Phone Call Modal Component
function PhoneCallModal({ 
  form, 
  onClose, 
  onSubmit 
}: { 
  form: AbandonedForm; 
  onClose: () => void; 
  onSubmit: (outcome: string, notes: string) => void;
}) {
  const [outcome, setOutcome] = useState('');
  const [notes, setNotes] = useState('');

  const outcomes = [
    { id: 'answered', label: 'Answered - Interested', color: 'bg-green-600' },
    { id: 'answered_not_interested', label: 'Answered - Not Interested', color: 'bg-orange-600' },
    { id: 'voicemail', label: 'Left Voicemail', color: 'bg-yellow-600' },
    { id: 'no_answer', label: 'No Answer', color: 'bg-blue-600' },
    { id: 'wrong_number', label: 'Wrong Number', color: 'bg-red-600' },
  ];

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-zinc-900 w-full sm:max-w-lg sm:rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-zinc-800 px-4 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Log Phone Call</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs text-zinc-500 uppercase tracking-wider mb-1 block">Called</label>
            <div className="bg-zinc-800 px-4 py-3 rounded-lg">
              <p className="text-white">{form.formData.phone}</p>
            </div>
          </div>

          <div>
            <label className="text-xs text-zinc-500 uppercase tracking-wider mb-2 block">Call Outcome</label>
            <div className="space-y-2">
              {outcomes.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setOutcome(opt.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    outcome === opt.id
                      ? `${opt.color} text-white`
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-zinc-500 uppercase tracking-wider mb-2 block">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes about the call..."
              className="w-full bg-zinc-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (!outcome) {
                  alert('Please select a call outcome');
                  return;
                }
                onSubmit(outcome.replace(/_/g, ' '), notes);
              }}
              disabled={!outcome}
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              Log Call
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
