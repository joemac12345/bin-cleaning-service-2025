import { NextRequest, NextResponse } from 'next/server';
import { DatabaseStorage, supabase } from '@/lib/supabaseStorage';

// PUT - Update booking status
export async function PUT(request: NextRequest) {
  try {
    console.log('📝 PUT /api/bookings/status called');
    
    const { bookingId, status, scheduledDate, notes } = await request.json();
    
    if (!bookingId || !status) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: bookingId and status' },
        { status: 400 }
      );
    }

    console.log(`🔄 Updating booking ${bookingId} status to: ${status}`);

    // Update the booking status in database
    const { data: updatedBooking, error } = await supabase
      .from('bookings')
      .update({
        status,
        scheduled_date: scheduledDate,
        notes,
        updated_at: new Date().toISOString()
      })
      .eq('booking_id', bookingId)
      .select()
      .single();

    if (error || !updatedBooking) {
      console.error('❌ Error updating booking status:', error);
      return NextResponse.json(
        { success: false, error: 'Booking not found or update failed' },
        { status: 404 }
      );
    }

    console.log('✅ Booking status updated successfully');

    // TODO: Send status update email notification
    // You can add email notification logic here if needed

    return NextResponse.json({
      success: true,
      message: 'Booking status updated successfully',
      booking: updatedBooking
    });

  } catch (error: any) {
    console.error('❌ Error updating booking status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update booking status', details: error.message },
      { status: 500 }
    );
  }
}

// GET - Get booking by ID with status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('bookingId');
    
    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: 'Missing booking ID' },
        { status: 400 }
      );
    }

    const { data: booking, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('booking_id', bookingId)
      .single();

    if (error || !booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      booking
    });

  } catch (error: any) {
    console.error('❌ Error fetching booking:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch booking', details: error.message },
      { status: 500 }
    );
  }
}
