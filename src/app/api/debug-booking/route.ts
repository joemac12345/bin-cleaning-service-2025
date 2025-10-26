import { NextRequest, NextResponse } from 'next/server';

// Debug endpoint to test the full booking flow
export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Debug Test: Starting booking submission test');
    
    // Test booking data
    const testBooking = {
      serviceType: 'regular',
      customerInfo: {
        firstName: 'Debug',
        lastName: 'Test',
        email: 'debug@test.com',
        phone: '07123456789',
        address: '123 Debug Street, Test City',
        postcode: 'DE1 1BG'
      },
      binSelection: {
        wheelie: 1,
        food: 0,
        recycling: 0,
        garden: 0
      },
      collectionDay: 'Monday',
      paymentMethod: 'card',
      specialInstructions: 'Debug test booking',
      pricing: {
        binTotal: 5,
        serviceCharge: 0,
        totalPrice: 5
      }
    };

    console.log('📤 Sending test booking to /api/bookings...');
    
    // Submit to the bookings API
    const bookingResponse = await fetch(new URL('/api/bookings', request.url), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testBooking),
    });

    const bookingResult = await bookingResponse.json();
    console.log('📥 Booking API response:', bookingResult);

    if (!bookingResponse.ok) {
      throw new Error(`Booking API failed: ${bookingResult.error}`);
    }

    // Now fetch all bookings to verify it was saved
    console.log('🔍 Fetching all bookings to verify...');
    const fetchResponse = await fetch(new URL('/api/bookings', request.url));
    const fetchResult = await fetchResponse.json();
    
    console.log('📋 Current bookings count:', fetchResult.bookings?.length || 0);

    return NextResponse.json({
      success: true,
      message: 'Debug test completed',
      bookingSubmission: bookingResult,
      currentBookings: fetchResult,
      testBookingId: bookingResult.bookingId
    });

  } catch (error) {
    console.error('❌ Debug test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'Debug booking submission test failed'
    }, { status: 500 });
  }
}
