/**
 * EMAIL SENDING DEBUGGING GUIDE
 * 
 * If emails are not being sent from the Booking Manager, follow these steps:
 */

// Step 1: Check the browser console when sending an email
// You should see these logs:
// 🚀 Sending templated email for booking: BK-xxx-xxx
// 📧 Template: booking-confirmation
// 📧 Customer email: customer@example.com
// 📝 Email payload: { type: 'admin-send', bookingId: '...', templateType: '...', ... }
// 📡 Email API response status: 200
// 📄 Email API response data: { success: true, messageId: '...', ... }

// Step 2: Check the server console logs
// When you send an email, you should see:
// 🚀 Gmail-only email service started
// 📝 Request details: { type: 'admin-send', templateType: '...', bookingId: '...', ... }
// ✅ Gmail SMTP service configured
// 📋 Found booking: { ... booking object ... }
// 👤 Customer info extracted: { firstName: '...', lastName: '...', email: '...', ... }
// ✅ Email sent successfully

// Step 3: Test the email endpoint directly
// curl -X POST http://localhost:3000/api/send-email \
//   -H "Content-Type: application/json" \
//   -d '{
//     "type": "admin-send",
//     "bookingId": "BK-1729094400000-abc123",
//     "templateType": "booking-confirmation",
//     "customMessage": "Test message"
//   }'

// Step 4: Test with a simple email endpoint
// curl -X POST http://localhost:3000/api/test-email \
//   -H "Content-Type: application/json" \
//   -d '{"testEmail":"nearbuy7@gmail.com"}'

// COMMON ISSUES AND FIXES:

// Issue: "Booking not found"
// Fix: Make sure the bookingId matches exactly (check admin panel for the ID)
// The bookingId is displayed under the customer name in each booking card

// Issue: "No email address found"
// Fix: Verify the booking has customer contact info
// Edit the booking and ensure email is filled in

// Issue: "Gmail SMTP not configured"
// Fix: Check .env.local has:
// GMAIL_USER=nearbuy7@gmail.com
// GMAIL_APP_PASS=zlahgfgbstcdeemd
// Then restart dev server (npm run dev)

// Issue: "Invalid templateType"
// Fix: Use one of these template types:
// - booking-confirmation
// - service-reminder
// - service-completion
// - payment-reminder
// - cancellation

console.log('📧 Email debugging guide loaded');
