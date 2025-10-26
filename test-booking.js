// Test booking submission
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
  specialInstructions: 'Test booking',
  pricing: {
    binTotal: 5,
    serviceCharge: 0,
    totalPrice: 5
  },
  status: 'pending',
  createdAt: new Date().toISOString(),
  bookingId: `BK-${Date.now()}-TEST`
};

fetch('https://mobile-bin-cleaning-pro.vercel.app/api/bookings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testBooking),
})
.then(response => response.json())
.then(data => console.log('Response:', data))
.catch(error => console.error('Error:', error));
