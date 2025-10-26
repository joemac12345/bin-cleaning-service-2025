import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/emailService';
import { PersistentStorage } from '@/lib/persistentStorage';

// Using new persistent storage system

// GET - Fetch all bookings (for admin)
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET /api/bookings called');
    const bookings = await PersistentStorage.getBookings();
    console.log('📊 Total bookings found:', bookings.length);
    
    // Optional: Add query parameters for filtering
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');
    
    let filteredBookings = bookings;
    
    if (status) {
      filteredBookings = bookings.filter((booking: any) => booking.status === status);
    }
    
    if (limit) {
      filteredBookings = filteredBookings.slice(0, parseInt(limit));
    }
    
    // Sort by creation date (newest first)
    filteredBookings.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return NextResponse.json({
      success: true,
      bookings: filteredBookings,
      total: bookings.length
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

// POST - Create new booking
export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Booking API POST endpoint called');
    console.log('📋 Request URL:', request.url);
    console.log('📋 Request method:', request.method);
    
    const bookingData = await request.json();
    
    console.log('📝 Received booking data:', {
      serviceType: bookingData.serviceType,
      customerName: bookingData.customerInfo?.firstName,
      hasCustomerInfo: !!bookingData.customerInfo,
      hasBinSelection: !!bookingData.binSelection
    });
    
    // Validate required fields
    const requiredFields = ['serviceType', 'customerInfo', 'binSelection'];
    for (const field of requiredFields) {
      if (!bookingData[field]) {
        console.error(`❌ Missing required field: ${field}`);
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    console.log('✅ All required fields present');
    
    // Generate unique booking ID if not provided
    if (!bookingData.bookingId) {
      bookingData.bookingId = `BK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    // Add timestamp if not provided
    if (!bookingData.createdAt) {
      bookingData.createdAt = new Date().toISOString();
    }
    
    // Set default status if not provided
    if (!bookingData.status) {
      bookingData.status = 'new-job';
    }
    
    // Add new booking using persistent storage
    try {
      await PersistentStorage.addBooking(bookingData);
      console.log('✅ Booking saved successfully:', bookingData.bookingId);
      
      // Immediately verify the save worked
      const verifyBookings = await PersistentStorage.getBookings();
      console.log('🔍 Verification: bookings count after save:', verifyBookings.length);
    } catch (writeError) {
      console.error('⚠️ Write error:', writeError);
      throw writeError;
    }
    
    // Send confirmation email to customer and admin notification
    try {
      const binCount = Object.values(bookingData.binSelection).reduce((total: number, quantity) => {
        return total + (typeof quantity === 'number' ? quantity : 0);
      }, 0);
      
      // Send customer confirmation
      const customerEmailResult = await emailService.sendBookingConfirmation({
        customerName: `${bookingData.customerInfo.firstName} ${bookingData.customerInfo.lastName}`,
        customerEmail: bookingData.customerInfo.email,
        bookingId: bookingData.bookingId,
        serviceType: bookingData.serviceType,
        collectionDay: bookingData.collectionDay,
        address: bookingData.customerInfo.address,
        binCount,
        totalPrice: bookingData.pricing.totalPrice,
        createdAt: bookingData.createdAt,
      });

      if (!customerEmailResult.success) {
        console.error('Failed to send customer confirmation email:', customerEmailResult.error);
      } else {
        console.log('Customer confirmation email sent successfully');
      }

      // Send admin notification
      const adminEmailResult = await emailService.sendAdminNotification({
        bookingId: bookingData.bookingId,
        customerName: `${bookingData.customerInfo.firstName} ${bookingData.customerInfo.lastName}`,
        customerEmail: bookingData.customerInfo.email,
        customerPhone: bookingData.customerInfo.phone,
        address: bookingData.customerInfo.address,
        serviceType: bookingData.serviceType,
        collectionDay: bookingData.collectionDay,
        totalPrice: bookingData.pricing.totalPrice,
        createdAt: bookingData.createdAt,
      });

      if (!adminEmailResult.success) {
        console.error('Failed to send admin notification email:', adminEmailResult.error);
      } else {
        console.log('Admin notification email sent successfully');
      }
    } catch (emailError) {
      console.error('Email service error:', emailError);
      // Don't fail the booking creation if email fails
    }
    
    return NextResponse.json({
      success: true,
      message: 'Booking created successfully',
      bookingId: bookingData.bookingId,
      booking: bookingData
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating booking:', error);
    
    // Provide more detailed error info for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create booking',
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// PUT - Update existing booking (for admin)
export async function PUT(request: NextRequest) {
  try {
    const { bookingId, updates } = await request.json();
    
    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: 'Missing booking ID' },
        { status: 400 }
      );
    }
    
    const bookings = await PersistentStorage.getBookings();
    const bookingIndex = bookings.findIndex((booking: any) => booking.bookingId === bookingId);
    
    if (bookingIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    // Update booking with new data
    bookings[bookingIndex] = {
      ...bookings[bookingIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await PersistentStorage.saveBookings(bookings);
    
    return NextResponse.json({
      success: true,
      message: 'Booking updated successfully',
      booking: bookings[bookingIndex]
    });
    
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}

// DELETE - Delete booking (for admin)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('bookingId');
    const clearAll = searchParams.get('clearAll');
    
    // Special endpoint to clear all data
    if (clearAll === 'true') {
      try {
        await PersistentStorage.clearAll();
        console.log('🧹 All bookings cleared from persistent storage');
        
        return NextResponse.json({
          success: true,
          message: 'All bookings cleared successfully',
          cleared: 'Persistent file storage'
        });
      } catch (error) {
        console.error('❌ Clear all failed:', error);
        return NextResponse.json({
          success: false,
          error: 'Failed to clear all bookings'
        }, { status: 500 });
      }
    }
    
    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: 'Missing booking ID' },
        { status: 400 }
      );
    }
    
    const bookings = await PersistentStorage.getBookings();
    console.log('📊 Current bookings before delete:', bookings.length, bookings.map((b: any) => b.bookingId));
    
    const deleteSuccess = await PersistentStorage.deleteBooking(bookingId);
    
    if (!deleteSuccess) {
      console.log('❌ Booking not found:', bookingId);
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    console.log('✅ Booking deleted successfully:', bookingId);
    
    return NextResponse.json({
      success: true,
      message: 'Booking deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete booking' },
      { status: 500 }
    );
  }
}
