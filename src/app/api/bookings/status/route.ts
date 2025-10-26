import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { emailService } from '@/lib/emailService';

const BOOKINGS_FILE = path.join(process.cwd(), 'data', 'bookings.json');

// Read bookings from file
async function readBookings() {
  try {
    const data = await fs.readFile(BOOKINGS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Write bookings to file
async function writeBookings(bookings: any[]) {
  const dataDir = path.dirname(BOOKINGS_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
  await fs.writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
}

export async function PATCH(request: NextRequest) {
  try {
    const { bookingId, status, notes } = await request.json();

    if (!bookingId || !status) {
      return NextResponse.json(
        { error: 'Booking ID and status are required' },
        { status: 400 }
      );
    }

    // Read current bookings
    const bookings = await readBookings();
    
    // Find and update the booking
    const bookingIndex = bookings.findIndex((booking: any) => booking.bookingId === bookingId);
    
    if (bookingIndex === -1) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    const oldStatus = bookings[bookingIndex].status;
    
    // Update the booking
    bookings[bookingIndex] = {
      ...bookings[bookingIndex],
      status,
      notes: notes || bookings[bookingIndex].notes,
      updatedAt: new Date().toISOString()
    };

    // Save updated bookings
    await writeBookings(bookings);

    // Send status update email if status actually changed
    if (oldStatus !== status) {
      try {
        const booking = bookings[bookingIndex];
        const emailResult = await emailService.sendStatusUpdate({
          customerName: `${booking.customerInfo.firstName} ${booking.customerInfo.lastName}`,
          customerEmail: booking.customerInfo.email,
          bookingId: booking.bookingId,
          serviceType: booking.serviceType,
          newStatus: status,
          address: booking.customerInfo.address,
          scheduledDate: booking.collectionDay,
          notes: notes
        });

        if (emailResult.success) {
          console.log(`Status update email sent for booking ${bookingId}: ${oldStatus} → ${status}`);
        } else {
          console.error(`Failed to send status update email for booking ${bookingId}:`, emailResult.error);
        }
      } catch (emailError) {
        console.error('Status update email error:', emailError);
        // Don't fail the status update if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Booking status updated successfully',
      booking: bookings[bookingIndex]
    });
  } catch (error) {
    console.error('Status update error:', error);
    return NextResponse.json(
      { error: 'Failed to update booking status' },
      { status: 500 }
    );
  }
}
