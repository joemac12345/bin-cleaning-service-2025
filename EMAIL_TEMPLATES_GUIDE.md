# Email Templates Guide

## Available Email Templates

Your email system now includes **5 professional email templates** to send to customers at different stages of their booking journey. You can select which template to send from the booking manager.

---

## 📧 Template Options

### 1. **Booking Confirmation** (Default)
- **When to use**: When a customer first completes their booking form
- **Subject**: Booking Confirmed
- **Purpose**: Confirms the booking details and provides the booking reference number
- **Includes**: 
  - Booking ID for reference
  - Service type and collection day
  - Address and postcode
  - Total price
  - Special instructions (if any)
  - Next steps

**Example**: After a customer fills out the booking form on the website

---

### 2. **Service Reminder**
- **When to use**: 2-3 days before the scheduled service
- **Subject**: Service Reminder - Don't Forget!
- **Purpose**: Reminds customer about their upcoming service
- **Includes**:
  - Booking details summary
  - Collection day reminder
  - Instructions to ensure bins are accessible
  - Contact information

**Example**: Send this Monday morning for a Thursday service

---

### 3. **Service Completion**
- **When to use**: After you complete the cleaning service
- **Subject**: Your Service is Complete ✓
- **Purpose**: Confirms service was completed successfully
- **Includes**:
  - Completion confirmation
  - Service date
  - Thank you message
  - Link to leave a review (optional)
  - Next steps for recurring services

**Example**: Send immediately after finishing the job

---

### 4. **Payment Reminder**
- **When to use**: If payment is pending or overdue
- **Subject**: Payment Reminder - Your Booking
- **Purpose**: Reminds customer about an outstanding payment
- **Includes**:
  - Booking ID
  - Amount due
  - Payment instructions
  - Due date
  - Contact for payment issues

**Example**: Send if customer hasn't paid 7 days after service completion

---

### 5. **Cancellation Confirmation**
- **When to use**: When a customer cancels their booking
- **Subject**: Booking Cancelled
- **Purpose**: Confirms cancellation and provides refund/rebooking information
- **Includes**:
  - Cancelled booking ID
  - Refund status
  - Options to rebook
  - Support contact information

**Example**: Send after customer requests cancellation

---

## 🚀 How to Send an Email

### From the Booking Manager

1. **Navigate** to `/admin/bookings`
2. **Find** the booking you want to email
3. **Click** the "Send Email" button (envelope icon) on the booking card
4. **Select** which template to send from the dropdown:
   - Booking Confirmation
   - Service Reminder
   - Service Completion
   - Payment Reminder
   - Cancellation Confirmation
5. **(Optional)** Add a custom message in the text area
6. **Click** "Send Email"
7. **Confirm** success message appears
8. **Customer receives** email within seconds

---

## ✨ Adding Custom Messages

Each template allows you to add a **custom message** that appears after the template content. This is perfect for:

- Personal notes from the team
- Special instructions for repeat customers
- Apologies or explanations
- Thank you messages beyond the template

**Example**: 
```
Thank you so much for being a regular customer! 
We really appreciate your business and will see you next week.
```

---

## 📊 Recommended Sending Schedule

For a typical customer journey:

| Stage | Template | Timing | Sent By |
|-------|----------|--------|---------|
| 1 | Booking Confirmation | Immediately after booking | Auto-sent by system |
| 2 | Service Reminder | 2-3 days before service | You (from admin) |
| 3 | Service Completion | Right after service finishes | You (from admin) |
| 4 | Payment Reminder | 7 days after service (if needed) | You (from admin, if payment pending) |

---

## 🔧 Technical Details

### Email Format
- All templates are professionally formatted HTML emails
- Responsive design works on mobile, tablet, and desktop
- Black and white with green accents for key information
- Includes company branding and footer

### Personalization
All templates automatically include:
- Customer first and last name
- Booking ID
- Service address and postcode
- Total price (where applicable)
- Collection day

### Delivery
- Emails sent via Gmail SMTP (nearbuy7@gmail.com)
- Instant delivery (usually arrives within seconds)
- Recipients can reply to support@bincleaningservice.com
- Emails appear as from "Bin Cleaning Service"

---

## 💡 Best Practices

1. **Send Service Reminder** 2-3 days before to reduce no-shows
2. **Send Service Completion** immediately after work to request reviews
3. **Add Custom Messages** for loyal/regular customers
4. **Use Payment Reminder** to collect outstanding payments
5. **Send Cancellation Confirmation** to maintain good relationships even when canceling

---

## 🎨 Template Customization

If you want to customize the email templates (change colors, text, layout), edit:
```
/src/lib/emailTemplates.ts
```

Each template is a function that takes customer data and returns HTML. Modify the HTML/CSS as needed.

---

## ❓ FAQ

**Q: Can I send the same template multiple times to a customer?**  
A: Yes, there's no limit. You can send Booking Confirmation twice if needed.

**Q: What if the customer's email is wrong?**  
A: The system will show an error. Go back to the booking and edit the customer email before trying again.

**Q: Can I preview the email before sending?**  
A: Yes! The modal shows a preview of which template you're sending and includes the description.

**Q: What happens if email sending fails?**  
A: You'll see an error message. Check that the customer email is correct and that Gmail SMTP is configured in your `.env.local`

**Q: Can I undo a sent email?**  
A: No, emails can't be unsent once sent. Make sure you select the right template before sending!

**Q: Do customers need to do anything to receive emails?**  
A: No, emails are sent automatically to their address from the booking form.

---

## 🔗 Related Resources

- **Email Configuration**: See `.env.local` for Gmail SMTP settings
- **API Endpoint**: `/api/send-email` handles email sending
- **Email Templates Code**: `/src/lib/emailTemplates.ts`
- **Admin Page**: `/src/app/admin/bookings/page.tsx`

---

## Summary

You now have **5 professional templates** ready to send at any time. Simply:
1. Open the booking manager
2. Click "Send Email" on a booking
3. Pick a template
4. Add optional custom message
5. Send!

No more sending the same email to everyone! 🎉
