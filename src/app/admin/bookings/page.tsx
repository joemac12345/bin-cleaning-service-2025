'use client';

import { useState, useEffect } from 'react';
import { Calendar, User, Phone, Mail, MapPin, Package, Clock, Edit3, Trash2, Eye, Filter, Search, RefreshCw, ChevronDown, Star, CheckCircle, Truck, CheckCheck, List } from 'lucide-react';

interface Booking {
  bookingId: string;
  serviceType: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    postcode: string;
  };
  binSelection: Record<string, number>;
  collectionDay: string;
  specialInstructions?: string;
  pricing: {
    binTotal: number;
    serviceCharge: number;
    totalPrice: number;
  };
  status: 'new-job' | 'completed';
  createdAt: string;
  updatedAt?: string;
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
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('new-job'); // Default to new jobs only
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>('all');
  const [dayFilter, setDayFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBooking, setEditedBooking] = useState<Booking | null>(null);

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

  // Filter bookings based on selected filters
  const applyFilters = () => {
    let filtered = bookings;

    // Filter by status
    if (statusFilter !== 'all') {
      if (statusFilter === 'active') {
        // Active jobs are new jobs that need attention
        filtered = filtered.filter(booking => booking.status === 'new-job');
      } else {
        filtered = filtered.filter(booking => booking.status === statusFilter);
      }
    }

    // Filter by service type
    if (serviceTypeFilter !== 'all') {
      filtered = filtered.filter(booking => booking.serviceType === serviceTypeFilter);
    }

    // Filter by collection day
    if (dayFilter !== 'all') {
      filtered = filtered.filter(booking => booking.collectionDay === dayFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(booking => 
        booking.bookingId.toLowerCase().includes(query) ||
        booking.customerInfo.firstName.toLowerCase().includes(query) ||
        booking.customerInfo.lastName.toLowerCase().includes(query) ||
        booking.customerInfo.email.toLowerCase().includes(query) ||
        booking.customerInfo.phone.includes(query) ||
        booking.customerInfo.address.toLowerCase().includes(query)
      );
    }

    // Sort bookings: new ones first, then by creation date (newest first)
    filtered.sort((a, b) => {
      const aIsNew = isNewBooking(a.createdAt);
      const bIsNew = isNewBooking(b.createdAt);
      
      // If one is new and other isn't, prioritize the new one
      if (aIsNew && !bIsNew) return -1;
      if (!aIsNew && bIsNew) return 1;
      
      // If both are new or both are old, sort by creation date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    setFilteredBookings(filtered);
  };

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

    const newBinSelection = {
      ...editedBooking.binSelection,
      [binId]: Math.max(0, quantity)
    };

    const newPricing = calculatePricing(newBinSelection, editedBooking.serviceType);

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
  }, []);

  useEffect(() => {
    applyFilters();
  }, [bookings, statusFilter, serviceTypeFilter, dayFilter, searchQuery]);

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
              <p className="text-sm text-gray-600 mt-1">{filteredBookings.length} of {bookings.length} bookings</p>
            </div>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        {/* Quick Filter Buttons */}
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap gap-2 lg:justify-center">
            <button
              onClick={() => setStatusFilter('active')}
              className={`flex items-center space-x-1 px-3 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                statusFilter === 'active' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Star className="w-3 h-3" />
              <span>New ({getJobCount('active')})</span>
            </button>
            <button
              onClick={() => setStatusFilter('new-job')}
              className={`flex items-center space-x-1 px-3 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                statusFilter === 'new-job' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Package className="w-3 h-3" />
              <span>New Jobs ({getJobCount('new-job')})</span>
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`flex items-center space-x-1 px-3 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                statusFilter === 'completed' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <CheckCheck className="w-3 h-3" />
              <span>Done ({getJobCount('completed')})</span>
            </button>
            <button
              onClick={() => setStatusFilter('all')}
              className={`flex items-center space-x-1 px-3 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                statusFilter === 'all' 
                  ? 'bg-gray-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <List className="w-3 h-3" />
              <span>All ({getJobCount('all')})</span>
            </button>
          </div>
        </div>

        {/* Search Bar - Hidden on Desktop */}
        <div className="relative md:hidden">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, booking ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter Toggle */}
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between p-3 bg-white border border-gray-300 rounded-lg"
          >
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="font-medium">Filters</span>
            {(statusFilter !== 'all' || serviceTypeFilter !== 'all' || dayFilter !== 'all') && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Active</span>
            )}
          </div>
          <ChevronDown className={`w-5 h-5 text-gray-400 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white p-4 rounded-lg border border-gray-300 space-y-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">New Jobs</option>
                <option value="all">All Status</option>
                <option value="new-job">New Job</option>
                <option value="completed">Job Completed</option>
              </select>
            </div>

            {/* Service Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
              <select
                value={serviceTypeFilter}
                onChange={(e) => setServiceTypeFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Services</option>
                <option value="regular">Regular Clean</option>
                <option value="oneoff">One-off Clean</option>
              </select>
            </div>

            {/* Day Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Collection Day</label>
              <select
                value={dayFilter}
                onChange={(e) => setDayFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Days</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
              </select>
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setStatusFilter('active'); // Reset to active jobs as default
                setServiceTypeFilter('all');
                setDayFilter('all');
                setSearchQuery('');
              }}
              className="w-full py-2 px-4 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Reset Filters
            </button>
            </div>
          </div>
        )}
      </div>

      {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Mobile-Friendly Booking Cards */}
        <div className="space-y-3 mx-4">
          {filteredBookings.map((booking) => (
            <div key={booking.bookingId} className={`bg-white rounded-lg p-4 max-w-2xl mx-auto ${isNewBooking(booking.createdAt) ? 'border-2 border-red-300 shadow-lg' : 'border border-gray-200'}`}>
              {/* Header Row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {booking.customerInfo.firstName} {booking.customerInfo.lastName}
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
                  <p className="text-xs text-gray-500 font-mono mb-1">ID: {booking.bookingId}</p>
                  <p className="text-xs text-gray-600">{booking.customerInfo.email}</p>
                </div>
                <div className="flex items-center space-x-2 ml-2">
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteBooking(booking.bookingId)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Service Details */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Service:</span>
                  <span className="ml-1 font-medium capitalize">{booking.serviceType}</span>
                </div>
                <div>
                  <span className="text-gray-500">Collection:</span>
                  <span className="ml-1 font-medium">{booking.collectionDay || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-500">Total:</span>
                  <span className="ml-1 font-bold text-green-600">£{booking.pricing.totalPrice}</span>
                </div>
                <div>
                  <span className="text-gray-500">Created:</span>
                  <span className="ml-1 font-medium">{formatDate(booking.createdAt).split(' ')[0]}</span>
                </div>
              </div>

              {/* Bins Summary */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-600">
                  <Package className="w-3 h-3 inline mr-1" />
                  {getTotalBinCount(booking.binSelection)} bins to clean
                </div>
              </div>

              {/* Status Selector */}
              <div className="mt-3">
                <select
                  value={booking.status}
                  onChange={(e) => updateBookingStatus(booking.bookingId, e.target.value)}
                  className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="new-job">New Job</option>
                  <option value="completed">Job Completed</option>
                </select>
              </div>
            </div>
          ))}
        </div>

        {filteredBookings.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No bookings found</p>
            {(statusFilter !== 'all' || serviceTypeFilter !== 'all' || dayFilter !== 'all' || searchQuery) && (
              <p className="text-sm text-gray-400 mt-2">Try adjusting your filters</p>
            )}
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
                            value={editedBooking.customerInfo.firstName}
                            onChange={(e) => setEditedBooking({
                              ...editedBooking,
                              customerInfo: { ...editedBooking.customerInfo, firstName: e.target.value }
                            })}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Last Name</label>
                          <input
                            type="text"
                            value={editedBooking.customerInfo.lastName}
                            onChange={(e) => setEditedBooking({
                              ...editedBooking,
                              customerInfo: { ...editedBooking.customerInfo, lastName: e.target.value }
                            })}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Email</label>
                        <input
                          type="email"
                          value={editedBooking.customerInfo.email}
                          onChange={(e) => setEditedBooking({
                            ...editedBooking,
                            customerInfo: { ...editedBooking.customerInfo, email: e.target.value }
                          })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Phone</label>
                        <input
                          type="tel"
                          value={editedBooking.customerInfo.phone}
                          onChange={(e) => setEditedBooking({
                            ...editedBooking,
                            customerInfo: { ...editedBooking.customerInfo, phone: e.target.value }
                          })}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Address</label>
                        <textarea
                          value={editedBooking.customerInfo.address}
                          onChange={(e) => setEditedBooking({
                            ...editedBooking,
                            customerInfo: { ...editedBooking.customerInfo, address: e.target.value }
                          })}
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
                          value={editedBooking.serviceType}
                          onChange={(e) => {
                            const newServiceType = e.target.value;
                            const newPricing = calculatePricing(editedBooking.binSelection, newServiceType);
                            setEditedBooking({
                              ...editedBooking,
                              serviceType: newServiceType,
                              pricing: newPricing
                            });
                          }}
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
                                  onClick={() => updateBinQuantity(binId, editedBooking.binSelection[binId] - 1)}
                                  disabled={editedBooking.binSelection[binId] <= 0}
                                  className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50 text-xs"
                                >
                                  −
                                </button>
                                <span className="w-6 text-center font-semibold text-xs">{editedBooking.binSelection[binId] || 0}</span>
                                <button
                                  type="button"
                                  onClick={() => updateBinQuantity(binId, (editedBooking.binSelection[binId] || 0) + 1)}
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
                        <span className="font-medium">£{editedBooking.pricing.binTotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service Charge:</span>
                        <span className="font-medium">£{editedBooking.pricing.serviceCharge}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2 font-bold">
                        <span className="text-gray-900">New Total:</span>
                        <span className="text-green-600">£{editedBooking.pricing.totalPrice}</span>
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
                        <span className="font-medium">{selectedBooking.customerInfo.firstName} {selectedBooking.customerInfo.lastName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{selectedBooking.customerInfo.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">{selectedBooking.customerInfo.phone}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-600 mb-1">Address:</span>
                        <span className="font-medium text-sm">{selectedBooking.customerInfo.address}</span>
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
                        <span className="font-medium text-sm">{formatBinSelection(selectedBooking.binSelection)}</span>
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
                        <span className="font-medium">£{selectedBooking.pricing.binTotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service Charge:</span>
                        <span className="font-medium">£{selectedBooking.pricing.serviceCharge}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-gray-900 font-semibold">Total:</span>
                        <span className="font-bold text-green-600">£{selectedBooking.pricing.totalPrice}</span>
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
                        updateBookingStatus(selectedBooking.bookingId, e.target.value);
                      }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="new-job">New Job</option>
                      <option value="completed">Job Completed</option>
                    </select>
                    
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this booking?')) {
                          deleteBooking(selectedBooking.bookingId);
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
    </div>
  );
}
