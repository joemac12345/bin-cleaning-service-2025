'use client';

import { useState, useEffect } from 'react';
import { Calendar, User, Phone, Mail, MapPin, Package, Clock, Edit3, Trash2, Eye, Filter, Search, RefreshCw, ChevronDown, Star, CheckCircle, Truck, CheckCheck, List, Send } from 'lucide-react';

interface Booking {
  // API format (camelCase)
  bookingId?: string;
  serviceType?: string;
  customerInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    postcode: string;
  };
  binSelection?: Record<string, number>;
  collectionDay?: string;
  specialInstructions?: string;
  pricing?: {
    binTotal: number;
    serviceCharge: number;
    totalPrice: number;
  };
  status: 'new-job' | 'completed';
  createdAt: string;
  updatedAt?: string;
  
  // Database format (snake_case)
  booking_id?: string;
  service_type?: string;
  customer_info?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    postcode: string;
  };
  bin_selection?: Record<string, number>;
  collection_day?: string;
  special_instructions?: string;
  created_at?: string;
  updated_at?: string;
}

const STATUS_COLORS = {
  'new-job': 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
};

const STATUS_LABELS = {
  'new-job': 'New Job',
  completed: 'Job Completed',
};

const BIN_TYPES = {
  wheelie: 'Wheelie Bin (Large)',
  food: 'Food Waste Bin',
  recycling: 'Recycling Bin',
  garden: 'Garden Waste Bin'
};

export default function BookingsAdmin() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBooking, setEditedBooking] = useState<Booking | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('booking-confirmation');
  const [customMessage, setCustomMessage] = useState('');
  const [emailTemplates, setEmailTemplates] = useState<any[]>([]);

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      console.log('🔍 Admin: Fetching bookings from /api/bookings...');
      
      const response = await fetch('/api/bookings');
      console.log('📡 Admin: Response status:', response.status);
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      
      const data = await response.json();
      console.log('📋 Admin: Received data:', data);
      console.log('📊 Admin: Bookings count:', data.bookings?.length || 0);
      
      setBookings(data.bookings || []);
    } catch (err) {
      console.error('❌ Admin: Error fetching bookings:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Fetch available email templates
  const fetchEmailTemplates = async () => {
    try {
      const response = await fetch('/api/send-email');
      if (!response.ok) {
        throw new Error('Failed to fetch email templates');
      }
      const data = await response.json();
      setEmailTemplates(data.templates || []);
    } catch (err) {
      console.error('Error fetching email templates:', err);
    }
  };

  // Filter and sort bookings by creation date (newest first)
  const filteredBookings = showCompleted 
    ? bookings 
    : bookings.filter(booking => booking.status !== 'completed');
    
  const sortedBookings = filteredBookings.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Start editing a booking
  const startEditing = (booking: Booking) => {
    setEditedBooking({ ...booking });
    setIsEditing(true);
  };

  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
    setEditedBooking(null);
  };

  // Update booking (full booking update)
  const updateBooking = async (updates: Partial<Booking>) => {
    if (!selectedBooking) return;

    try {
      const response = await fetch('/api/bookings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: selectedBooking.bookingId,
          updates
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update booking');
      }

      // Refresh bookings
      await fetchBookings();
      
      // Update selected booking
      const updatedBooking = { ...selectedBooking, ...updates };
      setSelectedBooking(updatedBooking);
      setEditedBooking(null);
      setIsEditing(false);
    } catch (err) {
      alert('Failed to update booking: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  // Update booking status only
  const updateBookingStatus = async (bookingId: string, newStatus: string, notes?: string) => {
    try {
      const response = await fetch('/api/bookings/status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          status: newStatus,
          notes
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update booking status');
      }

      const result = await response.json();
      console.log('Status updated:', result.message);

      // Refresh bookings
      await fetchBookings();
      
      // Update selected booking if it's the one being updated
      if (selectedBooking?.bookingId === bookingId) {
        setSelectedBooking(prev => prev ? { ...prev, status: newStatus as any } : null);
      }
    } catch (err) {
      alert('Failed to update booking status: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  // Send email to customer with selected template
  const sendTemplatedEmail = async (booking: Booking) => {
    const bookingId = getBookingId(booking);
    const customerInfo = getCustomerInfo(booking);
    
    if (!customerInfo.email) {
      alert('No email address found for this customer');
      return;
    }

    try {
      setSendingEmail(bookingId);
      console.log('🚀 Sending templated email for booking:', bookingId);
      console.log('📧 Template:', selectedTemplate);
      console.log('📧 Customer email:', customerInfo.email);
      
      const payload = {
        type: 'admin-send',
        bookingId: bookingId,
        templateType: selectedTemplate,
        customMessage: customMessage || undefined
      };

      console.log('📝 Email payload:', payload);

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('📡 Email API response status:', response.status);
      
      const result = await response.json();
      console.log('📄 Email API response data:', result);

      if (!response.ok) {
        console.error('❌ Email API error:', result);
        throw new Error(result.error || result.message || `HTTP ${response.status} error`);
      }

      console.log('✅ Email sent successfully:', result);
      alert(`✅ Email sent successfully to ${customerInfo.email}`);
      
      // Reset modal
      setShowEmailModal(false);
      setCustomMessage('');
      setSelectedTemplate('booking-confirmation');
      
    } catch (err) {
      console.error('💥 Email send error details:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      alert(`❌ Failed to send email: ${errorMessage}\n\nCheck browser console for details.`);
    } finally {
      setSendingEmail(null);
    }
  };

  // Send email to customer
  const sendEmailToCustomer = async (booking: Booking) => {
    const bookingId = getBookingId(booking);
    const customerInfo = getCustomerInfo(booking);
    
    if (!customerInfo.email) {
      alert('No email address found for this customer');
      return;
    }

    try {
      setSendingEmail(bookingId);
      console.log('🚀 Sending email for booking:', bookingId);
      console.log('📧 Customer email:', customerInfo.email);
      
      const binCount = Object.values(getBinSelection(booking)).reduce((total: number, quantity) => {
        return total + (typeof quantity === 'number' ? quantity : 0);
      }, 0);

      const emailPayload = {
        type: 'booking-confirmation',
        customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
        customerEmail: customerInfo.email,
        bookingId: bookingId,
        serviceType: getServiceType(booking),
        collectionDay: getCollectionDay(booking),
        address: customerInfo.address,
        binCount: binCount,
        totalPrice: getPricing(booking).totalPrice,
        createdAt: getCreatedAt(booking),
      };

      console.log('📝 Email payload:', emailPayload);

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailPayload),
      });

      console.log('📡 Email API response status:', response.status);
      
      let errorData;
      try {
        errorData = await response.json();
        console.log('📄 Email API response data:', errorData);
      } catch (parseError) {
        console.error('Failed to parse response JSON:', parseError);
        throw new Error(`HTTP ${response.status}: Unable to parse response`);
      }

      if (!response.ok) {
        console.error('❌ Email API error:', errorData);
        const errorMessage = errorData.error || errorData.message || `HTTP ${response.status} error`;
        const errorDetails = errorData.details ? ` - ${JSON.stringify(errorData.details)}` : '';
        throw new Error(`${errorMessage}${errorDetails}`);
      }

      console.log('✅ Email sent successfully:', errorData);
      alert(`✅ Confirmation email sent successfully to ${customerInfo.email}${errorData.data?.id ? ` (ID: ${errorData.data.id})` : ''}`);
      
    } catch (err) {
      console.error('💥 Email send error details:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      alert(`❌ Failed to send email: ${errorMessage}\n\nCheck browser console for details.`);
    } finally {
      setSendingEmail(null);
    }
  };

  // Calculate pricing for edited booking
  const calculatePricing = (binSelection: Record<string, number>, serviceType: string) => {
    const BIN_PRICES = {
      wheelie: 5,
      food: 3,
      recycling: 4,
      garden: 6
    };

    const binTotal = Object.entries(binSelection).reduce((total, [binId, quantity]) => {
      const price = BIN_PRICES[binId as keyof typeof BIN_PRICES] || 0;
      return total + (price * quantity);
    }, 0);

    const serviceCharge = serviceType === 'oneoff' ? 10 : 0;
    const totalPrice = binTotal + serviceCharge;

    return { binTotal, serviceCharge, totalPrice };
  };

  // Update bin quantity in edited booking
  const updateBinQuantity = (binId: string, quantity: number) => {
    if (!editedBooking) return;

    const currentBinSelection = getBinSelection(editedBooking);
    const newBinSelection = {
      ...currentBinSelection,
      [binId]: Math.max(0, quantity)
    };

    const currentServiceType = getServiceType(editedBooking);
    const newPricing = calculatePricing(newBinSelection, currentServiceType);

    setEditedBooking({
      ...editedBooking,
      binSelection: newBinSelection,
      pricing: newPricing
    });
  };

  // Delete booking
  const deleteBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) {
      return;
    }

    try {
      const response = await fetch(`/api/bookings?bookingId=${bookingId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete booking');
      }

      // Refresh bookings
      await fetchBookings();
      
      // Close modal if deleted booking was selected
      if (selectedBooking?.bookingId === bookingId) {
        setSelectedBooking(null);
      }
    } catch (err) {
      alert('Failed to delete booking: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchEmailTemplates();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  // Check if a booking is new (created within last 24 hours)
  const isNewBooking = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const hoursDiff = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
    return hoursDiff <= 24;
  };

  // Count jobs by status for button badges
  const getJobCount = (filterType: string) => {
    if (filterType === 'active') {
      return bookings.filter(booking => booking.status === 'new-job').length;
    } else if (filterType === 'all') {
      return bookings.length;
    } else {
      return bookings.filter(booking => booking.status === filterType).length;
    }
  };

  const formatBinSelection = (binSelection: Record<string, number>) => {
    return Object.entries(binSelection)
      .filter(([_, quantity]) => quantity > 0)
      .map(([binId, quantity]) => `${quantity}x ${BIN_TYPES[binId as keyof typeof BIN_TYPES]}`)
      .join(', ');
  };

  // Count total number of bins for display in job cards
  const getTotalBinCount = (binSelection: Record<string, number>) => {
    return Object.values(binSelection)
      .filter(quantity => quantity > 0)
      .reduce((total, quantity) => total + quantity, 0);
  };

  // Helper functions for safe data access (handles both API and database formats)
  const getBookingId = (booking: Booking) => booking.bookingId || booking.booking_id || '';
  const getServiceType = (booking: Booking) => booking.serviceType || booking.service_type || 'one-time';
  const getCustomerInfo = (booking: Booking) => booking.customerInfo || booking.customer_info || {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    postcode: ''
  };
  const getBinSelection = (booking: Booking) => booking.binSelection || booking.bin_selection || {};
  const getCollectionDay = (booking: Booking) => booking.collectionDay || booking.collection_day || '';
  const getSpecialInstructions = (booking: Booking) => booking.specialInstructions || booking.special_instructions || '';
  const getPricing = (booking: Booking) => booking.pricing || { binTotal: 0, serviceCharge: 0, totalPrice: 0 };
  const getCreatedAt = (booking: Booking) => booking.createdAt || booking.created_at || '';
  const getUpdatedAt = (booking: Booking) => booking.updatedAt || booking.updated_at || '';

  // Helper to safely update edited booking customer info
  const updateEditedBookingCustomer = (field: string, value: string) => {
    if (!editedBooking) return;
    const currentCustomerInfo = getCustomerInfo(editedBooking);
    setEditedBooking({
      ...editedBooking,
      customerInfo: { ...currentCustomerInfo, [field]: value }
    });
  };

  // Helper to safely update edited booking service type
  const updateEditedBookingServiceType = (serviceType: string) => {
    if (!editedBooking) return;
    const currentBinSelection = getBinSelection(editedBooking);
    const newPricing = calculatePricing(currentBinSelection, serviceType);
    setEditedBooking({
      ...editedBooking,
      serviceType,
      pricing: newPricing
    });
  };

  // Helper to safely update bin quantities in edited booking
  const updateEditedBookingBinQuantity = (binId: string, newQuantity: number) => {
    if (!editedBooking) return;
    const currentBinSelection = getBinSelection(editedBooking);
    const newBinSelection = { ...currentBinSelection, [binId]: Math.max(0, newQuantity) };
    const currentServiceType = getServiceType(editedBooking);
    const newPricing = calculatePricing(newBinSelection, currentServiceType);
    
    setEditedBooking({
      ...editedBooking,
      binSelection: newBinSelection,
      pricing: newPricing
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bookings Management</h1>
              <p className="text-sm text-gray-600 mt-1">
                {showCompleted ? bookings.length : filteredBookings.length} 
                {showCompleted ? ' total bookings' : ' active jobs'}
                {!showCompleted && bookings.filter(b => b.status === 'completed').length > 0 && (
                  <span className="text-gray-400 ml-1">
                    ({bookings.filter(b => b.status === 'completed').length} completed hidden)
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowCompleted(!showCompleted)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  showCompleted
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {showCompleted ? 'Hide Completed' : 'Show All'}
              </button>
              <button
                onClick={fetchBookings}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={loading}
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Simple Booking Cards - No Filters */}
        <div className="space-y-3">
          {sortedBookings.map((booking, index) => (
            <div key={booking.bookingId || booking.booking_id || `booking-${index}`} className={`bg-white rounded-lg p-4 max-w-2xl mx-auto ${isNewBooking(booking.createdAt) ? 'border-2 border-red-300 shadow-lg' : 'border border-gray-200'}`}>
              {/* Header Row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {booking.customerInfo?.firstName || booking.customer_info?.firstName || 'Unknown'} {booking.customerInfo?.lastName || booking.customer_info?.lastName || 'Customer'}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[booking.status]}`}>
                        {STATUS_LABELS[booking.status as keyof typeof STATUS_LABELS] || booking.status}
                      </span>
                      {isNewBooking(booking.createdAt) && (
                        <span className="inline-flex px-2 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800 animate-pulse">
                          NEW
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 font-mono mb-1">ID: {getBookingId(booking)}</p>
                  <p className="text-xs text-gray-600">{getCustomerInfo(booking).email}</p>
                </div>
                <div className="flex items-center space-x-2 ml-2">
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => sendEmailToCustomer(booking)}
                    disabled={sendingEmail === getBookingId(booking)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Send Email Confirmation"
                  >
                    {sendingEmail === getBookingId(booking) ? (
                      <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => deleteBooking(getBookingId(booking))}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                    title="Delete Booking"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Service Details */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Service:</span>
                  <span className="ml-1 font-medium capitalize">{getServiceType(booking)}</span>
                </div>
                <div>
                  <span className="text-gray-500">Collection:</span>
                  <span className="ml-1 font-medium">{getCollectionDay(booking) || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-500">Total:</span>
                  <span className="ml-1 font-bold text-green-600">£{getPricing(booking).totalPrice}</span>
                </div>
                <div>
                  <span className="text-gray-500">Created:</span>
                  <span className="ml-1 font-medium">{formatDate(getCreatedAt(booking)).split(' ')[0]}</span>
                </div>
              </div>

              {/* Bins Summary */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-600">
                  <Package className="w-3 h-3 inline mr-1" />
                  {getTotalBinCount(getBinSelection(booking))} bins to clean
                </div>
              </div>

              {/* Status Selector */}
              <div className="mt-3">
                <select
                  value={booking.status}
                  onChange={(e) => updateBookingStatus(getBookingId(booking), e.target.value)}
                  className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="new-job">New Job</option>
                  <option value="completed">Job Completed</option>
                </select>
              </div>
            </div>
          ))}
        </div>

        {sortedBookings.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No bookings found</p>
            <p className="text-sm text-gray-400 mt-2">New bookings will appear here</p>
          </div>
        )}

      {/* Mobile-Optimized Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg mx-auto mt-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {isEditing ? 'Edit Booking' : 'Booking Details'}
                </h3>
                <div className="flex items-center space-x-2">
                  {!isEditing && (
                    <button
                      onClick={() => startEditing(selectedBooking)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                      title="Edit Booking"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedBooking(null);
                      cancelEditing();
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-4 space-y-4">
              {/* Booking ID */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-600 font-mono">{selectedBooking.bookingId}</p>
              </div>

              {isEditing && editedBooking ? (
                /* Edit Mode */
                <>
                  {/* Customer Info - Editable */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Customer Information
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">First Name</label>
                          <input
                            type="text"
                            value={getCustomerInfo(editedBooking).firstName}
                            onChange={(e) => updateEditedBookingCustomer('firstName', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Last Name</label>
                          <input
                            type="text"
                            value={getCustomerInfo(editedBooking).lastName}
                            onChange={(e) => updateEditedBookingCustomer('lastName', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Email</label>
                        <input
                          type="email"
                          value={getCustomerInfo(editedBooking).email}
                          onChange={(e) => updateEditedBookingCustomer('email', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Phone</label>
                        <input
                          type="tel"
                          value={getCustomerInfo(editedBooking).phone}
                          onChange={(e) => updateEditedBookingCustomer('phone', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Address</label>
                        <textarea
                          value={getCustomerInfo(editedBooking).address}
                          onChange={(e) => updateEditedBookingCustomer('address', e.target.value)}
                          rows={2}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Service Details - Editable */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      <Package className="w-4 h-4 mr-2" />
                      Service Details
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Service Type</label>
                        <select
                          value={getServiceType(editedBooking)}
                          onChange={(e) => updateEditedBookingServiceType(e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="regular">Regular Clean</option>
                          <option value="oneoff">One-off Clean</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Collection Day</label>
                        <select
                          value={editedBooking.collectionDay || ''}
                          onChange={(e) => setEditedBooking({
                            ...editedBooking,
                            collectionDay: e.target.value
                          })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="">Not specified</option>
                          <option value="Monday">Monday</option>
                          <option value="Tuesday">Tuesday</option>
                          <option value="Wednesday">Wednesday</option>
                          <option value="Thursday">Thursday</option>
                          <option value="Friday">Friday</option>
                          <option value="Saturday">Saturday</option>
                        </select>
                      </div>

                      {/* Editable Bins */}
                      <div>
                        <label className="block text-xs text-gray-600 mb-2">Bins Selection</label>
                        <div className="space-y-2">
                          {Object.entries(BIN_TYPES).map(([binId, binName]) => (
                            <div key={binId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span className="text-xs font-medium">{binName}</span>
                              <div className="flex items-center space-x-2">
                                <button
                                  type="button"
                                  onClick={() => updateEditedBookingBinQuantity(binId, getBinSelection(editedBooking)[binId] - 1)}
                                  disabled={getBinSelection(editedBooking)[binId] <= 0}
                                  className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50 text-xs"
                                >
                                  −
                                </button>
                                <span className="w-6 text-center font-semibold text-xs">{getBinSelection(editedBooking)[binId] || 0}</span>
                                <button
                                  type="button"
                                  onClick={() => updateEditedBookingBinQuantity(binId, (getBinSelection(editedBooking)[binId] || 0) + 1)}
                                  className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-xs"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Special Instructions</label>
                        <textarea
                          value={editedBooking.specialInstructions || ''}
                          onChange={(e) => setEditedBooking({
                            ...editedBooking,
                            specialInstructions: e.target.value
                          })}
                          rows={2}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="Any special instructions..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Updated Pricing Display */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Updated Pricing
                    </h4>
                    <div className="bg-green-50 p-3 rounded-lg space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bin Total:</span>
                        <span className="font-medium">£{getPricing(editedBooking).binTotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service Charge:</span>
                        <span className="font-medium">£{getPricing(editedBooking).serviceCharge}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2 font-bold">
                        <span className="text-gray-900">New Total:</span>
                        <span className="text-green-600">£{getPricing(editedBooking).totalPrice}</span>
                      </div>
                    </div>
                  </div>

                  {/* Save/Cancel Buttons */}
                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    <button
                      onClick={() => updateBooking(editedBooking)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                /* View Mode */
                <>
                  {/* Customer Info - View Only */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Customer Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">{getCustomerInfo(selectedBooking).firstName} {getCustomerInfo(selectedBooking).lastName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{getCustomerInfo(selectedBooking).email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">{getCustomerInfo(selectedBooking).phone}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-600 mb-1">Address:</span>
                        <span className="font-medium text-sm">{getCustomerInfo(selectedBooking).address}</span>
                      </div>
                    </div>
                  </div>

                  {/* Service Details - View Only */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      <Package className="w-4 h-4 mr-2" />
                      Service Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service Type:</span>
                        <span className="font-medium capitalize">{selectedBooking.serviceType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Collection Day:</span>
                        <span className="font-medium">{selectedBooking.collectionDay || 'Not specified'}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-600 mb-1">Bins:</span>
                        <span className="font-medium text-sm">{formatBinSelection(getBinSelection(selectedBooking))}</span>
                      </div>
                      {selectedBooking.specialInstructions && (
                        <div className="flex flex-col">
                          <span className="text-gray-600 mb-1">Special Instructions:</span>
                          <span className="font-medium text-sm bg-yellow-50 p-2 rounded">{selectedBooking.specialInstructions}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pricing - View Only */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Pricing & Status
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bin Total:</span>
                        <span className="font-medium">£{getPricing(selectedBooking).binTotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service Charge:</span>
                        <span className="font-medium">£{getPricing(selectedBooking).serviceCharge}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-gray-900 font-semibold">Total:</span>
                        <span className="font-bold text-green-600">£{getPricing(selectedBooking).totalPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[selectedBooking.status]}`}>
                          {STATUS_LABELS[selectedBooking.status as keyof typeof STATUS_LABELS] || selectedBooking.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Created:</span>
                        <span className="font-medium">{formatDate(selectedBooking.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons - View Mode */}
                  <div className="pt-4 border-t border-gray-200 space-y-3">
                    <select
                      value={selectedBooking.status}
                      onChange={(e) => {
                        updateBookingStatus(getBookingId(selectedBooking), e.target.value);
                      }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="new-job">New Job</option>
                      <option value="completed">Job Completed</option>
                    </select>
                    
                    <button
                      onClick={() => {
                        setShowEmailModal(true);
                        setSelectedTemplate('booking-confirmation');
                        setCustomMessage('');
                      }}
                      disabled={sendingEmail === getBookingId(selectedBooking)}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {sendingEmail === getBookingId(selectedBooking) ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Email</span>
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this booking?')) {
                          deleteBooking(getBookingId(selectedBooking));
                        }
                      }}
                      className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Delete Booking
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Email Template Selection Modal */}
      {showEmailModal && selectedBooking && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg mx-auto mt-8 overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Send Email to Customer</h3>
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-4 space-y-4">
              {/* Customer Info */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-700">
                  <span className="font-semibold">{getCustomerInfo(selectedBooking).firstName} {getCustomerInfo(selectedBooking).lastName}</span>
                  <span className="text-blue-600"> ({getCustomerInfo(selectedBooking).email})</span>
                </p>
              </div>

              {/* Email Template Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-900">Select Email Template</label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {emailTemplates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name} - {template.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Template Preview */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">Email Template Details</p>
                <div className="text-sm text-gray-700 space-y-2">
                  {selectedTemplate === 'booking-confirmation' && (
                    <>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">📋</span>
                        <div>
                          <p className="font-semibold">Booking Confirmation</p>
                          <p className="text-xs text-gray-600">Sent when customer first books. Includes booking ID, date, address, and price.</p>
                        </div>
                      </div>
                    </>
                  )}
                  {selectedTemplate === 'service-reminder' && (
                    <>
                      <div className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">🔔</span>
                        <div>
                          <p className="font-semibold">Service Reminder</p>
                          <p className="text-xs text-gray-600">Reminder 2-3 days before service. Helps reduce no-shows.</p>
                        </div>
                      </div>
                    </>
                  )}
                  {selectedTemplate === 'service-completion' && (
                    <>
                      <div className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <div>
                          <p className="font-semibold">Service Completion</p>
                          <p className="text-xs text-gray-600">Sent after cleaning is complete. Great for requesting reviews!</p>
                        </div>
                      </div>
                    </>
                  )}
                  {selectedTemplate === 'payment-reminder' && (
                    <>
                      <div className="flex items-start gap-2">
                        <span className="text-orange-600 font-bold">💳</span>
                        <div>
                          <p className="font-semibold">Payment Reminder</p>
                          <p className="text-xs text-gray-600">For pending payments. Includes due date and payment instructions.</p>
                        </div>
                      </div>
                    </>
                  )}
                  {selectedTemplate === 'cancellation' && (
                    <>
                      <div className="flex items-start gap-2">
                        <span className="text-red-600 font-bold">✕</span>
                        <div>
                          <p className="font-semibold">Cancellation Confirmation</p>
                          <p className="text-xs text-gray-600">When booking is cancelled. Maintains good relationships.</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Custom Message */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900">
                  Add Custom Message (Optional)
                </label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Add a personal message to include with the email..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
                <p className="text-xs text-gray-600">
                  {customMessage.length} / 500 characters
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-200 space-y-2 flex gap-2">
                <button
                  onClick={() => {
                    sendTemplatedEmail(selectedBooking);
                  }}
                  disabled={sendingEmail === getBookingId(selectedBooking)}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {sendingEmail === getBookingId(selectedBooking) ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Email</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
