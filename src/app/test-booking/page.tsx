'use client';

import { useState } from 'react';

export default function BookingTestPage() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testBookingSubmission = async () => {
    setLoading(true);
    try {
      const testBooking = {
        serviceType: 'regular',
        customerInfo: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          phone: '07123456789',
          address: '123 Test Street, Test City',
          postcode: 'TE1 1ST'
        },
        binSelection: {
          wheelie: 1,
          food: 0,
          recycling: 0,
          garden: 0
        },
        collectionDay: 'Monday',
        paymentMethod: 'card',
        specialInstructions: 'Test booking from debug page',
        pricing: {
          binTotal: 5,
          serviceCharge: 0,
          totalPrice: 5
        }
      };

      console.log('Sending test booking:', testBooking);

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testBooking),
      });

      const responseText = await response.text();
      console.log('Response status:', response.status);
      console.log('Response text:', responseText);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${responseText}`);
      }

      const data = JSON.parse(responseText);
      setResult(`✅ SUCCESS: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      console.error('Test failed:', error);
      setResult(`❌ ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const checkBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      const data = await response.json();
      setResult(`📋 CURRENT BOOKINGS: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setResult(`❌ ERROR FETCHING: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Booking System Test</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
          <div className="space-x-4">
            <button
              onClick={testBookingSubmission}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Booking Submission'}
            </button>
            
            <button
              onClick={checkBookings}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Check Current Bookings
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Results</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {result || 'No tests run yet...'}
          </pre>
        </div>
      </div>
    </div>
  );
}
