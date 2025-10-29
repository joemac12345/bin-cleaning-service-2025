# Email Sending Verification Checklist

## ✅ Complete Setup Verification

### 1. Environment Variables Set
```bash
✅ GMAIL_USER=nearbuy7@gmail.com
✅ GMAIL_APP_PASS=zlahgfgbstcdeemd
```

### 2. Build Status
```bash
✅ npm run build - PASSED (no errors)
```

### 3. Fixed Issues
- ✅ API now handles nested `customerInfo` object properly
- ✅ Supports both camelCase and snake_case field names from database
- ✅ Correctly retrieves booking with multiple ID formats
- ✅ Fixed DatabaseStorage to use object methods (not class constructor)

---

## 📧 How to Test Emails Are Sending

### Option A: Use Admin Booking Manager (Recommended)

1. **Start dev server**: `npm run dev`
2. **Go to**: http://localhost:3000/admin/bookings
3. **Click**: "Send Email" button on any booking
4. **Select**: Email template (e.g., "Booking Confirmation")
5. **Add optional**: Custom message
6. **Click**: "Send Email" button
7. **Check**: Success notification + browser console for logs
8. **Verify**: Email arrives in inbox (check nearbuy7@gmail.com)

### Option B: Test Endpoint

```bash
# Test if Gmail is configured
curl http://localhost:3000/api/test-email

# Send test email
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"testEmail":"nearbuy7@gmail.com"}'
```

### Option C: Send Email to Specific Booking

1. **Get booking ID** from admin panel (displayed under customer name)
2. **Run curl command**:

```bash
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "type": "admin-send",
    "bookingId": "BK-1729094400000-abc123",
    "templateType": "service-reminder",
    "customMessage": "Looking forward to cleaning your bins!"
  }'
```

---

## 🔍 Browser Console Logs to Look For

When sending an email, you should see:

```
🚀 Sending templated email for booking: BK-xxx-xxx
📧 Template: booking-confirmation
📧 Customer email: customer@example.com
📝 Email payload: {type: 'admin-send', bookingId: '...', ...}
📡 Email API response status: 200
📄 Email API response data: {success: true, messageId: 'xxx', message: 'Email sent successfully...'}
✅ Email sent successfully to customer@example.com
```

---

## 🖥️ Server Console Logs to Look For

Check terminal running `npm run dev`:

```
🚀 Gmail-only email service started
📝 Request details: {type: 'admin-send', templateType: 'booking-confirmation', bookingId: 'BK-xxx', ...}
✅ Gmail SMTP service configured
📋 Found booking: {...complete booking object...}
👤 Customer info extracted: {firstName: '...', lastName: '...', email: '...', ...}
✅ Gmail email sent successfully: <message-id>
✅ Email sent successfully: {success: true, messageId: '...', simulation: false}
```

---

## 🚨 If Emails Still Aren't Sending

### Check 1: Verify Booking Has Email
```
In admin panel:
- Click eye icon on booking
- Check "Email" field in Customer Information section
- If empty, click Edit and add email address
```

### Check 2: Verify Gmail Credentials
```bash
# Check .env.local
grep GMAIL .env.local

# Should show:
# GMAIL_USER=nearbuy7@gmail.com
# GMAIL_APP_PASS=zlahgfgbstcdeemd
```

### Check 3: Restart Dev Server
```bash
# Stop current server (Ctrl+C)
npm run dev
```

### Check 4: Check Browser Console
```
1. Open browser DevTools (F12)
2. Go to Console tab
3. Send email from admin panel
4. Look for error messages
5. Copy full error and check EMAIL_DEBUGGING.md
```

### Check 5: Check Server Terminal
```
Look at terminal running "npm run dev"
For any error messages starting with ❌
```

---

## 📋 Template Types Available

You can send any of these templates:

| Template ID | Name | Use Case |
|---|---|---|
| `booking-confirmation` | Booking Confirmation | Confirm new booking received |
| `service-reminder` | Service Reminder | Remind before service date |
| `service-completion` | Service Completion | Confirm service was completed |
| `payment-reminder` | Payment Reminder | Remind about pending payment |
| `cancellation` | Cancellation Confirmation | Confirm booking cancellation |

---

## ✨ What Should Happen

1. **Admin clicks "Send Email"** → Modal opens showing template options
2. **Admin selects template** → Preview shows what email will look like
3. **Admin clicks "Send Email"** → Email is sent via Gmail SMTP
4. **Success notification appears** → "✅ Email sent successfully to customer@email.com"
5. **Customer receives email** → Professional HTML email in their inbox
6. **Email contains**:
   - Personalized greeting with customer name
   - Booking details (ID, service type, date, address, etc.)
   - Professional formatting and styling
   - Any custom message added by admin
   - Company branding and footer

---

## 🎯 Next Steps

1. **Restart dev server** to load new code
2. **Go to admin bookings page**
3. **Try sending an email** using the steps above
4. **Check success notification**
5. **Verify email in inbox** (nearbuy7@gmail.com)

If you see success notification but email doesn't arrive, check spam folder or verify Gmail settings allow SMTP access.

---

**All code is ready! Just restart dev server and try sending an email. ✅**
