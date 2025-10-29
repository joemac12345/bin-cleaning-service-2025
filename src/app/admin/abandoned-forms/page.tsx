'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  User,
  Mail, 
  Phone, 
  MapPin, 
  MessageCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Eye,
  Package
} from 'lucide-react';
import FormsManagementBottomMenu from '@/components/FormsManagementBottomMenu';

interface AbandonedForm {
  id: string;
  sessionId: string;
  postcode: string;
  formData: any;
  createdAt: string;
  lastUpdated: string;
  status: 'abandoned' | 'contacted' | 'converted' | 'unqualified';
  completionPercentage: number;
  potentialValue: number;
  contactInfo: {
    hasEmail: boolean;
    hasPhone: boolean;
    hasName: boolean;
  };
  notes?: string;
}

interface Stats {
  total: number;
  withEmail: number;
  withPhone: number;
  withContact: number;
  highValue: number;
  averageCompletion: number;
  totalPotentialValue: number;
}

export default function AbandonedFormsPage() {
  const [forms, setForms] = useState<AbandonedForm[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState<AbandonedForm | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  // Fetch abandoned forms
  const fetchForms = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/abandoned-forms');
      const data = await response.json();
      
      if (data.success) {
        setForms(data.forms);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching forms:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update form status
  const updateFormStatus = async (formId: string, status: string, notes?: string) => {
    try {
      setUpdatingStatus(formId);
      const response = await fetch('/api/abandoned-forms', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formId, status, notes })
      });

      if (response.ok) {
        // Refresh the forms list
        await fetchForms();
        setSelectedForm(null);
      }
    } catch (error) {
      console.error('Error updating form status:', error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Convert abandoned form to actual booking
  const convertToBooking = async (form: AbandonedForm) => {
    try {
      setUpdatingStatus(form.id);
      
      // Create booking from abandoned form data
      const bookingData = {
        serviceType: form.formData.serviceType || 'one-off',
        customerInfo: {
          firstName: form.formData.firstName || 'Unknown',
          lastName: form.formData.lastName || 'Customer',
          email: form.formData.email || '',
          phone: form.formData.phone || '',
          address: form.formData.address || `${form.postcode} area`,
          postcode: form.postcode
        },
        binSelection: form.formData.binQuantities || {},
        collectionDay: form.formData.collectionDay || 'To be arranged',
        specialInstructions: form.formData.specialInstructions || 'Converted from abandoned form - contact customer to confirm details',
        pricing: {
          binTotal: form.potentialValue,
          serviceCharge: 0,
          totalPrice: form.potentialValue
        },
        status: 'new-job'
      };

      // Create the booking
      const bookingResponse = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      if (bookingResponse.ok) {
        // Mark form as converted
        await updateFormStatus(form.id, 'converted', 'Converted to booking');
        
        // Show success message
        alert('Successfully converted to booking! The customer now appears in your bookings manager.');
        
        // Close modal
        setSelectedForm(null);
      } else {
        throw new Error('Failed to create booking');
      }
    } catch (error) {
      console.error('Error converting to booking:', error);
      alert('Failed to convert to booking. Please try again.');
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Use all forms without filtering
  const filteredForms = forms;

  // Export forms to CSV
  const exportToCSV = () => {
    const headers = ['Date', 'Name', 'Email', 'Phone', 'Postcode', 'Completion %', 'Potential Value', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredForms.map(form => [
        new Date(form.createdAt).toLocaleDateString(),
        `"${form.formData.firstName} ${form.formData.lastName}"`,
        form.formData.email || '',
        form.formData.phone || '',
        form.postcode,
        form.completionPercentage,
        `£${form.potentialValue}`,
        form.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `abandoned-forms-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'abandoned': return 'bg-red-100 text-red-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'converted': return 'bg-green-100 text-green-800';
      case 'unqualified': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'abandoned': return <XCircle className="w-4 h-4" />;
      case 'contacted': return <MessageCircle className="w-4 h-4" />;
      case 'converted': return <CheckCircle className="w-4 h-4" />;
      case 'unqualified': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 pb-80">
      {/* Header */}
      <div className="bg-gradient-to-r from-black to-zinc-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-white">Abandoned Forms</h1>
          <p className="text-zinc-300 mt-2">Follow up with customers who started booking but didn't finish</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div>
            <p className="text-zinc-600 dark:text-zinc-400">Recover lost revenue through targeted remarketing</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={fetchForms}
              disabled={loading}
              className="inline-flex items-center justify-center px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-600 disabled:opacity-50 text-sm font-medium transition-colors"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={exportToCSV}
              className="inline-flex items-center justify-center px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-100 text-sm font-medium transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
            <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 hover:shadow-md dark:hover:shadow-lg transition-all">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Total Abandoned Forms</h3>
                  <p className="text-3xl font-bold text-zinc-900 dark:text-white mt-2">{stats.total}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">Forms started but not completed</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 hover:shadow-md dark:hover:shadow-lg transition-all">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <MessageCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Ready to Contact</h3>
                  <p className="text-3xl font-bold text-zinc-900 dark:text-white mt-2">{stats.withContact}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">Forms with email or phone provided</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Forms List */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <RefreshCw className="w-8 h-8 animate-spin text-zinc-400 dark:text-zinc-500" />
            </div>
          ) : !filteredForms || filteredForms.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-2">No abandoned forms found</h3>
              <p className="text-zinc-500 dark:text-zinc-400">
                Abandoned forms will appear here when customers start but don't complete the booking process
              </p>
            </div>
          ) : (
            <>
              {/* Mobile Card Layout */}
              <div className="block md:hidden space-y-3 px-2">
                {filteredForms.map((form) => (
                  <div key={form.id} className="border-2 border-red-300 rounded-lg p-3 bg-white shadow-sm active:shadow-md transition-shadow">
                    {/* Header Row */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-gray-900 truncate">
                          {form.formData.firstName} {form.formData.lastName}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mt-2">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium whitespace-nowrap">
                            Abandoned Form
                          </span>
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium whitespace-nowrap">
                            ABANDONED
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-2">
                        <button
                          onClick={() => setSelectedForm(form)}
                          className="p-3 text-gray-600 hover:text-gray-800 active:bg-gray-100 rounded-lg touch-manipulation"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* ID and Contact Info */}
                    <div className="mb-3">
                      <p className="text-xs text-gray-600 mb-1 font-mono">
                        ID: ABN-{form.id.split('-').pop()}
                      </p>
                      {form.formData.email && (
                        <p className="text-sm text-gray-700 truncate">{form.formData.email}</p>
                      )}
                      {form.formData.phone && (
                        <p className="text-sm text-gray-700">{form.formData.phone}</p>
                      )}
                    </div>

                    {/* Service and Collection Info */}
                    <div className="grid grid-cols-1 gap-2 mb-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service:</span>
                        <span className="font-medium capitalize">
                          {form.formData.serviceType || 'Not specified'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium">{form.postcode}</span>
                      </div>
                    </div>

                    {/* Total and Created Info */}
                    <div className="grid grid-cols-1 gap-2 mb-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total:</span>
                        <span className="font-bold text-green-600 text-base">£{form.potentialValue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Created:</span>
                        <span className="font-medium">
                          {new Date(form.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Progress and Bin Count */}
                    <div className="flex items-center text-xs text-gray-600 mb-4 bg-gray-50 p-2 rounded">
                      <Package className="w-3 h-3 mr-2 flex-shrink-0" />
                      <span className="flex-1">
                        {form.completionPercentage}% complete
                        {form.formData.binQuantities && Object.values(form.formData.binQuantities).reduce((sum: number, qty: any) => sum + qty, 0) > 0 && 
                          ` • ${Object.values(form.formData.binQuantities).reduce((sum: number, qty: any) => sum + qty, 0)} bins selected`
                        }
                      </span>
                    </div>

                    {/* Status Dropdown */}
                    <div className="flex items-center space-x-2">
                      <select
                        value={form.status}
                        onChange={(e) => updateFormStatus(form.id, e.target.value)}
                        disabled={updatingStatus === form.id}
                        className="border border-gray-300 rounded-lg px-3 py-3 text-sm bg-white flex-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-manipulation"
                      >
                        <option value="abandoned">Abandoned</option>
                        <option value="contacted">Contacted</option>
                        <option value="converted">Converted</option>
                        <option value="unqualified">Unqualified</option>
                      </select>
                      {updatingStatus === form.id && (
                        <div className="flex-shrink-0">
                          <RefreshCw className="w-5 h-5 animate-spin text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table Layout */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Progress
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Value
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredForms.map((form) => (
                      <tr key={form.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {form.formData.firstName} {form.formData.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {form.formData.email && (
                                <div className="flex items-center">
                                  <Mail className="w-3 h-3 mr-1" />
                                  {form.formData.email}
                                </div>
                              )}
                              {form.formData.phone && (
                                <div className="flex items-center">
                                  <Phone className="w-3 h-3 mr-1" />
                                  {form.formData.phone}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                            {form.postcode}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${form.completionPercentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">{form.completionPercentage}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          £{form.potentialValue}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(form.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(form.status)}`}>
                            {getStatusIcon(form.status)}
                            <span className="ml-1 capitalize">{form.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => setSelectedForm(form)}
                            className="text-black hover:text-gray-600 flex items-center"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Enhanced Form Management Modal */}
        {selectedForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
            <div className="bg-white rounded-t-xl sm:rounded-lg max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">Manage Abandoned Form</h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Created: {new Date(selectedForm.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedForm(null)}
                    className="text-gray-400 hover:text-gray-600 p-2 sm:p-1 -m-2 sm:m-0 touch-manipulation"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                  {/* Left Column - Customer Information */}
                  <div className="space-y-6">
                    {/* Contact Information */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        Customer Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-3" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {selectedForm.formData.firstName} {selectedForm.formData.lastName}
                            </p>
                            <p className="text-sm text-gray-500">Customer Name</p>
                          </div>
                        </div>
                        
                        {selectedForm.formData.email && (
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 text-gray-400 mr-3" />
                            <div>
                              <p className="text-gray-900">{selectedForm.formData.email}</p>
                              <p className="text-sm text-gray-500">Email Address</p>
                            </div>
                          </div>
                        )}
                        
                        {selectedForm.formData.phone && (
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 text-gray-400 mr-3" />
                            <div>
                              <p className="text-gray-900">{selectedForm.formData.phone}</p>
                              <p className="text-sm text-gray-500">Phone Number</p>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-gray-400 mr-3" />
                          <div>
                            <p className="text-gray-900">{selectedForm.formData.address || `${selectedForm.postcode} area`}</p>
                            <p className="text-sm text-gray-500">Service Address</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Service Information */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <Package className="w-5 h-5 mr-2" />
                        Service Details
                      </h3>
                      <div className="space-y-3">
                        {selectedForm.formData.serviceType && (
                          <div>
                            <p className="font-medium text-gray-900 capitalize">{selectedForm.formData.serviceType.replace('-', ' ')} Service</p>
                            <p className="text-sm text-gray-500">Service Type</p>
                          </div>
                        )}
                        
                        {selectedForm.formData.binQuantities && Object.entries(selectedForm.formData.binQuantities).some(([_, qty]: [string, any]) => qty > 0) && (
                          <div>
                            <p className="font-medium text-gray-900 mb-2">Bin Selection:</p>
                            <div className="space-y-1">
                              {Object.entries(selectedForm.formData.binQuantities).map(([binType, quantity]: [string, any]) => {
                                if (quantity > 0) {
                                  const binNames = {
                                    wheelie: 'Wheelie Bin',
                                    food: 'Food Waste Bin',
                                    recycling: 'Recycling Bin',
                                    garden: 'Garden Waste Bin'
                                  };
                                  return (
                                    <p key={binType} className="text-sm text-gray-600">
                                      {quantity}x {binNames[binType as keyof typeof binNames] || binType}
                                    </p>
                                  );
                                }
                                return null;
                              })}
                            </div>
                          </div>
                        )}
                        
                        {selectedForm.formData.collectionDay && (
                          <div>
                            <p className="font-medium text-gray-900">{selectedForm.formData.collectionDay}</p>
                            <p className="text-sm text-gray-500">Collection Day</p>
                          </div>
                        )}
                        
                        <div>
                          <p className="font-medium text-gray-900">£{selectedForm.potentialValue}</p>
                          <p className="text-sm text-gray-500">Estimated Value</p>
                        </div>
                      </div>
                    </div>

                    {/* Form Progress */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Form Completion</h3>
                      <div className="flex items-center mb-3">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-blue-600 h-3 rounded-full" 
                            style={{ width: `${selectedForm.completionPercentage}%` }}
                          ></div>
                        </div>
                        <span className="ml-3 text-sm text-gray-600">{selectedForm.completionPercentage}%</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Last activity: {new Date(selectedForm.lastUpdated).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Right Column - Actions */}
                  <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <Phone className="w-5 h-5 mr-2 text-blue-600" />
                        Follow-up Actions
                      </h3>
                      
                      {/* Convert to Booking Button */}
                      <button
                        onClick={() => convertToBooking(selectedForm)}
                        disabled={updatingStatus === selectedForm.id}
                        className="w-full bg-green-600 text-white px-4 py-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 mb-3 flex items-center justify-center touch-manipulation text-base"
                      >
                        {updatingStatus === selectedForm.id ? (
                          <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                        ) : (
                          <CheckCircle className="w-5 h-5 mr-2" />
                        )}
                        Convert to Booking
                      </button>
                      
                      <div className="text-sm text-gray-600 mb-4 bg-green-50 p-3 rounded border-l-4 border-green-400">
                        This will create a new booking with the provided information and mark this form as converted.
                      </div>
                      
                      {/* Contact Methods */}
                      {selectedForm.formData.phone && (
                        <div className="mb-3">
                          <a
                            href={`tel:${selectedForm.formData.phone}`}
                            className="w-full bg-blue-600 text-white px-4 py-4 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center touch-manipulation text-base"
                          >
                            <Phone className="w-5 h-5 mr-2" />
                            Call {selectedForm.formData.phone}
                          </a>
                        </div>
                      )}
                      
                      {selectedForm.formData.email && (
                        <div className="mb-4">
                          <a
                            href={`mailto:${selectedForm.formData.email}?subject=Complete Your Bin Cleaning Booking&body=Hi ${selectedForm.formData.firstName},%0A%0AWe noticed you started booking our bin cleaning service but didn't complete it. We'd love to help you finish your booking!%0A%0APlease reply to this email or call us to complete your booking.%0A%0AThanks!`}
                            className="w-full bg-gray-600 text-white px-4 py-4 rounded-lg font-medium hover:bg-gray-700 flex items-center justify-center touch-manipulation text-base"
                          >
                            <Mail className="w-5 h-5 mr-2" />
                            Email {selectedForm.formData.firstName}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Status Management */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Update Status</h3>
                      <div className="space-y-2">
                        {['contacted', 'converted', 'unqualified'].map((status) => (
                          <button
                            key={status}
                            onClick={() => updateFormStatus(selectedForm.id, status)}
                            disabled={updatingStatus === selectedForm.id}
                            className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              selectedForm.status === status
                                ? 'bg-gray-900 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                            } disabled:opacity-50`}
                          >
                            {updatingStatus === selectedForm.id ? (
                              <RefreshCw className="w-4 h-4 animate-spin mx-auto" />
                            ) : (
                              <>
                                {status === 'contacted' && <Phone className="w-4 h-4 inline mr-2" />}
                                {status === 'converted' && <CheckCircle className="w-4 h-4 inline mr-2" />}
                                {status === 'unqualified' && <XCircle className="w-4 h-4 inline mr-2" />}
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Menu */}
      <FormsManagementBottomMenu
        totalForms={filteredForms?.length || 0}
        contactedCount={filteredForms?.filter(f => f.status === 'contacted').length || 0}
        convertedCount={filteredForms?.filter(f => f.status === 'converted').length || 0}
        abandonedCount={filteredForms?.filter(f => f.status === 'abandoned').length || 0}
        unqualifiedCount={filteredForms?.filter(f => f.status === 'unqualified').length || 0}
        totalPotentialValue={filteredForms?.reduce((sum, f) => sum + f.potentialValue, 0) || 0}
        withContactInfo={filteredForms?.filter(f => f.contactInfo.hasEmail || f.contactInfo.hasPhone).length || 0}
        onRefresh={fetchForms}
        onExport={exportToCSV}
        isLoading={loading}
        hasData={(filteredForms?.length || 0) > 0}
      />
    </div>
  );
}
