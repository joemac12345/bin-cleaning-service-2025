'use client';

import { useState, useEffect } from 'react';
import { Calendar, User, Phone, Mail, MapPin, Package, Clock, Edit3, Trash2, Eye, Filter, Search, RefreshCw, ChevronDown, Star, CheckCircle, Truck, CheckCheck, List, Send, X } from 'lucide-react';
import SendEmailModal from '@/components/SendEmailModal';
import BookingBottomMenu from '@/components/BookingBottomMenu';

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
  const [emailBooking, setEmailBooking] = useState<Booking | null>(null);
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
  const updateBooking = async (editedData: Booking) => {
    if (!selectedBooking) return;

    try {
      // Convert camelCase fields to snake_case for database
      const updates: any = {};
      
      if (editedData.serviceType) {
        updates.service_type = editedData.serviceType;
      }
      if (editedData.customerInfo) {
        updates.customer_info = editedData.customerInfo;
      }
      if (editedData.binSelection) {
        updates.bin_selection = editedData.binSelection;
      }
      if (editedData.collectionDay) {
        updates.collection_day = editedData.collectionDay;
      }
      if (editedData.specialInstructions !== undefined) {
        updates.special_instructions = editedData.specialInstructions;
      }
      if (editedData.pricing) {
        updates.pricing = editedData.pricing;
      }
      if (editedData.status) {
        updates.status = editedData.status;
      }

      console.log('📝 Sending updates to API:', updates);

      const response = await fetch('/api/bookings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: selectedBooking.bookingId || selectedBooking.booking_id,
          updates
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update booking');
      }

      const result = await response.json();
      console.log('✅ Booking updated successfully:', result);

      // Refresh bookings
      await fetchBookings();
      
      // Update selected booking with the response data
      if (result.booking) {
        setSelectedBooking(result.booking);
      }
      setEditedBooking(null);
      setIsEditing(false);
      
      alert('Booking updated successfully!');
    } catch (err) {
      console.error('❌ Error updating booking:', err);
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

  // Handle sending email from the new modal
  const handleSendEmailFromModal = async (templateId: string, customMessage: string) => {
    if (!emailBooking) return;

    const bookingId = getBookingId(emailBooking);
    const customerInfo = getCustomerInfo(emailBooking);

    if (!customerInfo.email) {
      alert('No email address found for this customer');
      return;
    }

    try {
      setSendingEmail(bookingId);
      console.log('🚀 Sending email from modal for booking:', bookingId);
      console.log('📧 Template:', templateId);
      console.log('📧 Customer email:', customerInfo.email);
      console.log('📧 Customer name:', `${customerInfo.firstName} ${customerInfo.lastName}`);

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'admin-send',
          bookingId,
          templateType: templateId,
          customMessage: customMessage || undefined,
        }),
      });

      const result = await response.json();
      
      console.log('📨 API Response:', {
        status: response.status,
        ok: response.ok,
        result: result
      });

      if (!response.ok) {
        const errorMsg = result.error || result.message || 'Failed to send email';
        console.error('❌ API Error:', errorMsg);
        throw new Error(errorMsg);
      }

      if (!result.success) {
        console.error('❌ Email send failed:', result);
        throw new Error(result.error || 'Email sending failed');
      }

      console.log('✅ Email sent successfully:', result);
      alert(`✅ Email sent successfully to ${customerInfo.email}`);
    } catch (err) {
      console.error('❌ Email send error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ Full error object:', err);
      alert(`❌ Failed to send email: ${errorMessage}`);
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
      <div className="min-h-screen bg-white dark:bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mx-auto mb-4"></div>
          <p className="text-zinc-600 dark:text-zinc-300">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 flex flex-col pb-24">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-black to-zinc-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Bookings Management</h1>
            <p className="text-sm text-zinc-300 mt-2">
              {showCompleted ? bookings.length : filteredBookings.length} 
              {showCompleted ? ' total bookings' : ' active jobs'}
              {!showCompleted && bookings.filter(b => b.status === 'completed').length > 0 && (
                <span className="text-zinc-400 ml-1">
                  ({bookings.filter(b => b.status === 'completed').length} completed hidden)
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        {error && (
          <div className="bg-red-900/20 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Simple Booking Cards */}
        <div className="space-y-3">
          {sortedBookings.map((booking, index) => (
            <div key={booking.bookingId || booking.booking_id || `booking-${index}`} className={`bg-white dark:bg-zinc-800 rounded-lg p-4 max-w-2xl mx-auto ${isNewBooking(booking.createdAt) ? 'border-2 border-red-500 shadow-lg dark:shadow-red-900/50' : 'border border-zinc-200 dark:border-zinc-700'}`}>
              {/* Header Row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                      {booking.customerInfo?.firstName || booking.customer_info?.firstName || 'Unknown'} {booking.customerInfo?.lastName || booking.customer_info?.lastName || 'Customer'}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${booking.status === 'new-job' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'}`}>
                        {STATUS_LABELS[booking.status as keyof typeof STATUS_LABELS] || booking.status}
                      </span>
                      {isNewBooking(booking.createdAt) && (
                        <span className="inline-flex px-2 py-1 text-xs font-bold rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 animate-pulse">
                          NEW
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono mb-1">ID: {getBookingId(booking)}</p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300">{getCustomerInfo(booking).email}</p>
                </div>
                <div className="flex items-center space-x-2 ml-2">
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEmailBooking(booking);
                      setShowEmailModal(true);
                    }}
                    disabled={sendingEmail === getBookingId(booking)}
                    className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Send Email to Customer"
                  >
                    {sendingEmail === getBookingId(booking) ? (
                      <div className="w-4 h-4 border-2 border-green-600 dark:border-green-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => deleteBooking(getBookingId(booking))}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors"
                    title="Delete Booking"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Service Details */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-zinc-500 dark:text-zinc-400">Service:</span>
                  <span className="ml-1 font-medium capitalize text-zinc-900 dark:text-white">{getServiceType(booking)}</span>
                </div>
                <div>
                  <span className="text-zinc-500 dark:text-zinc-400">Collection:</span>
                  <span className="ml-1 font-medium text-zinc-900 dark:text-white">{getCollectionDay(booking) || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-zinc-500 dark:text-zinc-400">Total:</span>
                  <span className="ml-1 font-bold text-green-600 dark:text-green-400">£{getPricing(booking).totalPrice}</span>
                </div>
                <div>
                  <span className="text-zinc-500 dark:text-zinc-400">Created:</span>
                  <span className="ml-1 font-medium text-zinc-900 dark:text-white">{formatDate(getCreatedAt(booking)).split(' ')[0]}</span>
                </div>
              </div>

              {/* Bins Summary */}
              <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-700">
                <div className="text-xs text-zinc-600 dark:text-zinc-300">
                  <Package className="w-3 h-3 inline mr-1" />
                  {getTotalBinCount(getBinSelection(booking))} bins to clean
                </div>
              </div>

              {/* Status Selector */}
              <div className="mt-3">
                <select
                  value={booking.status}
                  onChange={(e) => updateBookingStatus(getBookingId(booking), e.target.value)}
                  className="w-full text-sm border border-zinc-300 dark:border-zinc-600 rounded px-3 py-2 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                >
                  <option value="new-job">New Job</option>
                  <option value="completed">Job Completed</option>
                </select>
              </div>
            </div>
          ))}
        </div>

        {sortedBookings.length === 0 && !loading && (
          <div className="text-center py-12 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
            <Package className="w-12 h-12 text-zinc-400 dark:text-zinc-500 mx-auto mb-4" />
            <p className="text-zinc-500 dark:text-zinc-400">No bookings found</p>
            <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-2">New bookings will appear here</p>
          </div>
        )}
      </div>

      {/* Mobile-Optimized Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/60 z-50 p-0 sm:p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-none sm:rounded-lg shadow-xl w-full h-full sm:max-w-4xl sm:mx-auto sm:max-h-[90vh] overflow-y-auto flex flex-col">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-black to-zinc-800 border-b border-zinc-700 px-4 sm:px-6 py-4 sm:rounded-t-lg flex items-center justify-between flex-shrink-0">
              <h3 className="text-lg sm:text-xl font-semibold text-white">
                {isEditing ? 'Edit Booking' : 'Booking Details'}
              </h3>
              <div className="flex items-center space-x-2">
                {!isEditing && (
                  <button
                    onClick={() => startEditing(selectedBooking)}
                    className="p-2 text-blue-400 hover:bg-zinc-700 rounded-full transition-colors"
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
                  className="p-2 hover:bg-zinc-700 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 space-y-6 bg-white dark:bg-zinc-900 flex-1 overflow-y-auto">
              {/* Booking ID */}
              <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-600 dark:text-blue-300 font-mono">{selectedBooking.bookingId}</p>
              </div>

              {isEditing && editedBooking ? (
                /* Edit Mode */
                <>
                  {/* Customer Info - Editable */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Customer Information
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">First Name</label>
                          <input
                            type="text"
                            value={getCustomerInfo(editedBooking).firstName}
                            onChange={(e) => updateEditedBookingCustomer('firstName', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 dark:border-zinc-600 rounded text-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">Last Name</label>
                          <input
                            type="text"
                            value={getCustomerInfo(editedBooking).lastName}
                            onChange={(e) => updateEditedBookingCustomer('lastName', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 dark:border-zinc-600 rounded text-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">Email</label>
                        <input
                          type="email"
                          value={getCustomerInfo(editedBooking).email}
                          onChange={(e) => updateEditedBookingCustomer('email', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-zinc-600 rounded text-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">Phone</label>
                        <input
                          type="tel"
                          value={getCustomerInfo(editedBooking).phone}
                          onChange={(e) => updateEditedBookingCustomer('phone', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-zinc-600 rounded text-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">Address</label>
                        <textarea
                          value={getCustomerInfo(editedBooking).address}
                          onChange={(e) => updateEditedBookingCustomer('address', e.target.value)}
                          rows={2}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-zinc-600 rounded text-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Service Details - Editable */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
                      <Package className="w-4 h-4 mr-2" />
                      Service Details
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">Service Type</label>
                        <select
                          value={getServiceType(editedBooking)}
                          onChange={(e) => updateEditedBookingServiceType(e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-zinc-600 rounded text-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                        >
                          <option value="regular">Regular Clean</option>
                          <option value="oneoff">One-off Clean</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">Collection Day</label>
                        <select
                          value={editedBooking.collectionDay || ''}
                          onChange={(e) => setEditedBooking({
                            ...editedBooking,
                            collectionDay: e.target.value
                          })}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-zinc-600 rounded text-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
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
                        <label className="block text-xs text-gray-600 dark:text-gray-300 mb-2">Bins Selection</label>
                        <div className="space-y-2">
                          {Object.entries(BIN_TYPES).map(([binId, binName]) => (
                            <div key={binId} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-zinc-800 rounded border border-gray-200 dark:border-zinc-700">
                              <span className="text-xs font-medium text-gray-900 dark:text-white">{binName}</span>
                              <div className="flex items-center space-x-2">
                                <button
                                  type="button"
                                  onClick={() => updateEditedBookingBinQuantity(binId, getBinSelection(editedBooking)[binId] - 1)}
                                  disabled={getBinSelection(editedBooking)[binId] <= 0}
                                  className="w-6 h-6 rounded-full border border-gray-300 dark:border-zinc-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 disabled:opacity-50 text-xs bg-white dark:bg-zinc-800"
                                >
                                  −
                                </button>
                                <span className="w-6 text-center font-semibold text-xs text-gray-900 dark:text-white">{getBinSelection(editedBooking)[binId] || 0}</span>
                                <button
                                  type="button"
                                  onClick={() => updateEditedBookingBinQuantity(binId, (getBinSelection(editedBooking)[binId] || 0) + 1)}
                                  className="w-6 h-6 rounded-full border border-gray-300 dark:border-zinc-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 text-xs bg-white dark:bg-zinc-800"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">Special Instructions</label>
                        <textarea
                          value={editedBooking.specialInstructions || ''}
                          onChange={(e) => setEditedBooking({
                            ...editedBooking,
                            specialInstructions: e.target.value
                          })}
                          rows={2}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-zinc-600 rounded text-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                          placeholder="Any special instructions..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Updated Pricing Display */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Updated Pricing
                    </h4>
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg space-y-2 text-sm border border-green-200 dark:border-green-800">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Bin Total:</span>
                        <span className="font-medium text-gray-900 dark:text-white">£{getPricing(editedBooking).binTotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Service Charge:</span>
                        <span className="font-medium text-gray-900 dark:text-white">£{getPricing(editedBooking).serviceCharge}</span>
                      </div>
                      <div className="flex justify-between border-t border-green-200 dark:border-green-800 pt-2 font-bold">
                        <span className="text-gray-900 dark:text-white">New Total:</span>
                        <span className="text-green-600 dark:text-green-400">£{getPricing(editedBooking).totalPrice}</span>
                      </div>
                    </div>
                  </div>

                  {/* Save/Cancel Buttons */}
                  <div className="pt-4 border-t border-gray-200 dark:border-zinc-700 space-y-2">
                    <button
                      onClick={() => updateBooking(editedBooking)}
                      className="w-full bg-blue-600 dark:bg-blue-700 text-white py-2 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="w-full bg-gray-300 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-400 dark:hover:bg-zinc-600 transition-colors"
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
                    <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Customer Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Name:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{getCustomerInfo(selectedBooking).firstName} {getCustomerInfo(selectedBooking).lastName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Email:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{getCustomerInfo(selectedBooking).email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Phone:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{getCustomerInfo(selectedBooking).phone}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-600 dark:text-gray-300 mb-1">Address:</span>
                        <span className="font-medium text-sm text-gray-900 dark:text-white">{getCustomerInfo(selectedBooking).address}</span>
                      </div>
                    </div>
                  </div>

                  {/* Service Details - View Only */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
                      <Package className="w-4 h-4 mr-2" />
                      Service Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Service Type:</span>
                        <span className="font-medium capitalize text-gray-900 dark:text-white">{selectedBooking.serviceType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Collection Day:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{selectedBooking.collectionDay || 'Not specified'}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-600 dark:text-gray-300 mb-1">Bins:</span>
                        <span className="font-medium text-sm text-gray-900 dark:text-white">{formatBinSelection(getBinSelection(selectedBooking))}</span>
                      </div>
                      {selectedBooking.specialInstructions && (
                        <div className="flex flex-col">
                          <span className="text-gray-600 dark:text-gray-300 mb-1">Special Instructions:</span>
                          <span className="font-medium text-sm bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded text-gray-900 dark:text-white border border-yellow-200 dark:border-yellow-800">{selectedBooking.specialInstructions}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pricing - View Only */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Pricing & Status
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Bin Total:</span>
                        <span className="font-medium text-gray-900 dark:text-white">£{getPricing(selectedBooking).binTotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Service Charge:</span>
                        <span className="font-medium text-gray-900 dark:text-white">£{getPricing(selectedBooking).serviceCharge}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-200 dark:border-zinc-700 pt-2">
                        <span className="text-gray-900 dark:text-white font-semibold">Total:</span>
                        <span className="font-bold text-green-600 dark:text-green-400">£{getPricing(selectedBooking).totalPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Status:</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[selectedBooking.status]}`}>
                          {STATUS_LABELS[selectedBooking.status as keyof typeof STATUS_LABELS] || selectedBooking.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Created:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{formatDate(selectedBooking.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons - View Mode */}
                  <div className="pt-4 border-t border-gray-200 dark:border-zinc-700 space-y-3">
                    <select
                      value={selectedBooking.status}
                      onChange={(e) => {
                        updateBookingStatus(getBookingId(selectedBooking), e.target.value);
                      }}
                      className="w-full border border-gray-300 dark:border-zinc-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
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
                      className="w-full bg-green-600 dark:bg-green-700 text-white py-2 px-4 rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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



      {/* Send Email Modal */}
      {showEmailModal && emailBooking && (
        <SendEmailModal
          customerEmail={getCustomerInfo(emailBooking).email}
          customerName={`${getCustomerInfo(emailBooking).firstName} ${getCustomerInfo(emailBooking).lastName}`}
          bookingId={getBookingId(emailBooking)}
          onSend={handleSendEmailFromModal}
          onClose={() => {
            setShowEmailModal(false);
            setEmailBooking(null);
          }}
          isLoading={sendingEmail === getBookingId(emailBooking)}
        />
      )}

      {/* Bottom Menu */}
      <BookingBottomMenu
        showCompleted={showCompleted}
        onToggleShowCompleted={() => setShowCompleted(!showCompleted)}
        onFilterPending={() => setShowCompleted(false)}
        onFilterAll={() => setShowCompleted(true)}
        onRefresh={fetchBookings}
        isLoading={loading}
        activeJobsCount={bookings.filter(b => b.status === 'new-job').length}
        completedJobsCount={bookings.filter(b => b.status === 'completed').length}
      />
    </div>
  );
}
