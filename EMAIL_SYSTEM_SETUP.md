# Email Management System Setup - Complete Integration Guide

## ✅ What's Been Built

Your Bin Cleaning app now has a **complete email management system** with these components:

### 1. **Email Templates System** (`/src/lib/emailTemplates.ts`)
- ✅ 5 professional HTML email templates:
  - Booking Confirmation
  - Service Reminder
  - Service Completion
  - Payment Reminder
  - Cancellation Confirmation
- ✅ Fully customizable with booking data
- ✅ Professional styling with responsive design

### 2. **Email API Endpoint** (`/src/app/api/send-email/route.ts`)
- ✅ `type: 'admin-send'` - Send templated emails from admin panel
- ✅ `type: 'booking-confirmation'` - Auto-send on booking creation
- ✅ `type: 'admin-notification'` - Notify admin of new bookings
- ✅ GET endpoint - Lists all available templates

### 3. **Admin Booking Manager UI** (`/src/app/admin/bookings/page.tsx`)
- ✅ "Send Email" button on each booking
- ✅ Email template selection modal
- ✅ Template preview with descriptions
- ✅ Custom message textarea
- ✅ Loading states and success notifications

### 4. **Gmail SMTP Service** (`/src/lib/gmail-sender.ts`)
- ✅ Nodemailer integration with Gmail
- ✅ App Password authentication
- ✅ Simulation mode for testing (no credentials needed)
- ✅ Error handling and logging

### 5. **Test Endpoint** (`/src/app/api/test-email/route.ts`)
- ✅ Test if Gmail SMTP is configured
- ✅ Send test emails to verify setup

---

## 🔧 Configuration - What You Need to Do

### Step 1: Generate Gmail App Password

1. Go to **myaccount.google.com**
2. Click **Security** in the left sidebar
3. Scroll down to **App passwords** (if 2FA is enabled)
4. Select "Mail" and "Windows/Mac"
5. Click **Generate**
6. Copy the **16-character password** (spaces included or removed)

### Step 2: Update `.env.local`

The `.env.local` file has been updated with:

```bash
GMAIL_USER=nearbuy7@gmail.com
GMAIL_APP_PASS=YOUR_APP_PASSWORD_HERE
```

**Replace `YOUR_APP_PASSWORD_HERE`** with your 16-character Gmail app password.

### Step 3: Restart Dev Server

```bash
# Stop the current dev server (Ctrl+C)
# Then restart it
npm run dev
```

---

## 🧪 Test It's Working

### Option 1: Use the Test Endpoint

```bash
# Test email endpoint
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"testEmail":"your@email.com"}'
```

Expected response:
```json
{
  "success": true,
  "message": "✅ Test email sent successfully!",
  "details": {
    "emailSent": "your@email.com",
    "gmailAccount": "nearbuy7@gmail.com"
  }
}
```

### Option 2: Use the Admin Panel

1. Go to **Bookings Manager** admin page
2. Click **"Send Email"** on any booking
3. Select an email template from the dropdown
4. (Optional) Add a custom message
5. Click **"Send Email"** button
6. Check for success notification

---

## 📊 How It Works - Flow Diagram

```
Admin Booking Manager
      ↓
   "Send Email" button
      ↓
   Email Modal Opens
      ↓
   Select Template + Custom Message
      ↓
   POST /api/send-email
      ├─ type: 'admin-send'
      ├─ bookingId: 'BK-xxx'
      ├─ templateType: 'service-reminder'
      └─ customMessage: 'Optional text'
      ↓
   API Endpoint
      ├─ Validates request
      ├─ Fetches booking from Supabase
      ├─ Gets email template
      ├─ Adds custom message if provided
      └─ Sends via Gmail SMTP
      ↓
   sendEmailViaGmail()
      ├─ Creates nodemailer transporter
      ├─ Sends email via Gmail
      └─ Returns success/error
      ↓
   Admin sees success notification
   Customer receives email
```

---

## 🎯 Available Email Templates

When sending from admin panel, you can choose:

| Template | Use Case | Subject Line |
|----------|----------|--------------|
| Booking Confirmation | New booking received | `Booking Confirmed - ID: BK-xxx` |
| Service Reminder | Remind before service | `Reminder: Your bin cleaning is Monday` |
| Service Completion | After service done | `Service Complete - ID: BK-xxx` |
| Payment Reminder | Payment pending | `Payment Reminder - ID: BK-xxx` |
| Cancellation | Booking cancelled | `Booking Cancelled - ID: BK-xxx` |

---

## 🚨 Troubleshooting

### Error: "Gmail SMTP not configured"
- ✅ Check `.env.local` has `GMAIL_USER` and `GMAIL_APP_PASS`
- ✅ Restart dev server after updating `.env.local`
- ✅ Verify app password (16 characters, spaces optional)

### Error: "Invalid credentials"
- ✅ Verify you're using App Password, not regular Gmail password
- ✅ App Password must be generated from myaccount.google.com
- ✅ Check Gmail account allows "Less secure apps" (if using old auth)

### Email not sending in production
- ✅ Add environment variables to your deployment platform:
  - `GMAIL_USER=nearbuy7@gmail.com`
  - `GMAIL_APP_PASS=your_app_password`
- ✅ Verify production environment can reach Gmail SMTP servers
- ✅ Check firewall/network isn't blocking port 587 (SMTP)

### Emails going to spam
- ✅ Email templates have proper "From" address
- ✅ Consider setting up SPF/DKIM records for custom domain
- ✅ Templates include proper unsubscribe info

---

## 📝 Code Files Created/Modified

### New Files:
- `/src/lib/emailTemplates.ts` - Email templates with 5 different types
- `/src/app/api/test-email/route.ts` - Already existed, used for testing

### Modified Files:
- `/src/app/api/send-email/route.ts` - Added `type: 'admin-send'` handler
- `/src/app/admin/bookings/page.tsx` - Added email modal and send functionality
- `/.env.local` - Added Gmail configuration

---

## 🎉 Next Steps

1. **Add App Password to `.env.local`** (from Step 2 above)
2. **Restart dev server**
3. **Test using test endpoint or admin panel**
4. **Deploy to production with same environment variables**

---

## 💡 Features You Can Use Now

✅ Send booking confirmation emails with full details  
✅ Send service reminders before scheduled service  
✅ Send payment reminders for unpaid bookings  
✅ Send service completion emails after job done  
✅ Send cancellation confirmations  
✅ Add custom personal messages to any email  
✅ All emails have professional HTML formatting  
✅ Mobile-responsive email design  
✅ Automatic booking confirmation emails  

---

**Everything is ready! Just add your Gmail App Password and you're good to go! 🚀**
