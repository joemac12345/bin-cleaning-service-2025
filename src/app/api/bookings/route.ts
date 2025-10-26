import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { emailService } from '@/lib/emailService';

// Netlify-compatible file-based storage 
const BOOKINGS_FILE = path.join(process.cwd(), 'data', 'bookings.json');

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.dirname(BOOKINGS_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Read bookings from file
async function readBookings() {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(BOOKINGS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist or is empty, return empty array
    return [];
  }
}

// Write bookings to file
async function writeBookings(bookings: any[]) {
  await ensureDataDirectory();
  await fs.writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
}

// GET - Fetch all bookings (for admin)
export async function GET(request: NextRequest) {
  try {
    const bookings = await readBookings();
    
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
    const bookingData = await request.json();
    
    // Validate required fields
    const requiredFields = ['serviceType', 'customerInfo', 'binSelection'];
    for (const field of requiredFields) {
      if (!bookingData[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
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
    
    // Read existing bookings and add new one
    const bookings = await readBookings();
    bookings.push(bookingData);
    
    // Save updated bookings
    await writeBookings(bookings);
    
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
    return NextResponse.json(
      { success: false, error: 'Failed to create booking' },
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
    
    const bookings = await readBookings();
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
    
    await writeBookings(bookings);
    
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
    
    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: 'Missing booking ID' },
        { status: 400 }
      );
    }
    
    const bookings = await readBookings();
    const filteredBookings = bookings.filter((booking: any) => booking.bookingId !== bookingId);
    
    if (filteredBookings.length === bookings.length) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    await writeBookings(filteredBookings);
    
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
