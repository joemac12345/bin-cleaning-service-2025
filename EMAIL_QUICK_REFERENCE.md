# Email Templates Quick Reference

## 🚀 How to Use

1. Go to **Admin Bookings** (`/admin/bookings`)
2. Find the booking you want to email
3. Click **"Send Email"** button
4. **Select a template** from the dropdown
5. **(Optional)** Add a custom message
6. **Click "Send Email"**
7. Confirm success notification

---

## 📧 The 5 Email Templates

| # | Template | Icon | When to Send | Use Case |
|---|----------|------|--------------|----------|
| 1 | **Booking Confirmation** | 📋 | Immediately after booking | Customer first completes booking form |
| 2 | **Service Reminder** | 🔔 | 2-3 days before service | Before the scheduled cleaning day |
| 3 | **Service Completion** | ✓ | Right after finishing job | Immediately after cleaning is done |
| 4 | **Payment Reminder** | 💳 | 7+ days after service | When payment is still pending |
| 5 | **Cancellation** | ✕ | When booking is cancelled | To maintain good relationships |

---

## 🎯 Email Workflow Example

```
Customer Books
     ↓
Booking Confirmation ← Automatic (or send manually)
     ↓
(Wait 2-3 days)
     ↓
Service Reminder ← You send before service
     ↓
(Service day arrives)
     ↓
Service Completion ← You send after cleaning
     ↓
(If no payment)
     ↓
Payment Reminder ← You send if needed
```

---

## ✨ Key Features

### 📝 What's Included in Every Email
- ✓ Customer name (personalized)
- ✓ Booking ID (for reference)
- ✓ Service address & postcode
- ✓ Service date/collection day
- ✓ Total price
- ✓ Professional branding
- ✓ Support contact info

### 💬 Custom Messages
Add a personal note to any email:
- "Thank you for being a regular!"
- "Just wanted to confirm we'll be there Tuesday 10am"
- "We noticed a pipe issue you might want to check"
- Any message up to 500 characters

### ⚡ Instant Delivery
- Emails sent via Gmail SMTP
- Delivered within seconds
- Recipients can reply to support email
- Professional HTML formatting

---

## 🎨 Template Descriptions

### 1️⃣ Booking Confirmation
- **Best for**: First contact after booking
- **Content**: Confirms all booking details, next steps
- **Subject**: Booking Confirmed
- **Use when**: Customer submits booking form (can send automatically or manually)

### 2️⃣ Service Reminder  
- **Best for**: Reducing no-shows
- **Content**: Reminds about upcoming date, how to prepare
- **Subject**: Service Reminder - Don't Forget!
- **Use when**: 2-3 days before scheduled service

### 3️⃣ Service Completion
- **Best for**: Customer satisfaction
- **Content**: Confirms service done, requests feedback
- **Subject**: Your Service is Complete ✓
- **Use when**: Right after you finish the job

### 4️⃣ Payment Reminder
- **Best for**: Collecting payments
- **Content**: Shows amount due, due date, payment method
- **Subject**: Payment Reminder - Your Booking
- **Use when**: Payment is pending (typically 7+ days later)

### 5️⃣ Cancellation Confirmation
- **Best for**: Professional service
- **Content**: Confirms cancellation, refund info, rebook option
- **Subject**: Booking Cancelled
- **Use when**: Customer requests cancellation

---

## 💡 Pro Tips

✓ **Send Service Reminder** 2-3 days early to confirm before the day  
✓ **Send Service Completion** immediately while it's fresh (ask for review!)  
✓ **Add Custom Messages** for returning customers - they'll appreciate it  
✓ **Use Payment Reminder** to collect outstanding payments without awkwardness  
✓ **Mix & Match** - send different templates to different customers based on needs

---

## ❓ Common Questions

**Q: Can I send the same template twice?**  
A: Yes! No limit on how many times you can send each template.

**Q: What if I send the wrong template?**  
A: Can't undo, so double-check before clicking send!

**Q: Do I need to edit emails?**  
A: No! They're all professionally formatted. Just pick, optionally add a note, and send.

**Q: Will customers see my personal email?**  
A: Emails come from "Bin Cleaning Service" via nearbuy7@gmail.com, replies go to support.

**Q: How many characters can my custom message be?**  
A: Up to 500 characters (shown in character counter).

---

## 🔗 Email Sending Flow

```
You click "Send Email" on booking card
        ↓
Modal opens with template selector
        ↓
You choose template (Booking Confirmation, etc.)
        ↓
You optionally add custom message
        ↓
You click "Send Email" button
        ↓
API retrieves booking from database
        ↓
Template is rendered with customer data
        ↓
Email sent via Gmail SMTP
        ↓
"Success!" notification appears
        ↓
Customer receives email in inbox (within seconds)
```

---

## 📊 Email Status Tracking

After sending, you'll see:
- ✅ **Green success notification** = Email sent successfully
- ❌ **Red error notification** = Failed (check email address)
- ⏳ **Spinner** = Currently sending

---

## 🎯 Getting Started Right Now

1. **Open** the booking manager: `/admin/bookings`
2. **Find** a booking to email
3. **Click** "Send Email" button
4. **Try** the "Booking Confirmation" template first
5. **Click** "Send Email"
6. **Congratulations!** Email successfully sent! 🎉

---

## 📚 More Info

- Full guide: `EMAIL_TEMPLATES_GUIDE.md`
- Gmail setup: `.env.local`
- Email code: `/src/lib/emailTemplates.ts`
- API: `/src/app/api/send-email/route.ts`

---

**You now have 5 professional email templates at your fingertips!** 🚀
