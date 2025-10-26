# Gmail Email Setup Guide

## Prerequisites
You need a Gmail account to send booking confirmation emails.

## Step 1: Enable App Passwords in Gmail

1. **Go to your Google Account settings**: https://myaccount.google.com/
2. **Navigate to Security** (left sidebar)
3. **Enable 2-Step Verification** (if not already enabled)
4. **Generate App Password**:
   - Go to "App passwords" section
   - Select "Mail" as the app
   - Select "Other" as the device and name it "Bin Cleaning Service"
   - Copy the generated 16-character password

## Step 2: Configure Environment Variables

Edit the `.env.local` file in your project root:

```env
# Gmail SMTP Configuration
GMAIL_EMAIL=your-actual-gmail@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password

# Company Details (customize these)
COMPANY_NAME=Your Bin Cleaning Service
COMPANY_EMAIL=support@yourdomain.com
COMPANY_PHONE=+44 123 456 7890
```

## Step 3: Test Email Functionality

1. Start your development server: `npm run dev`
2. Create a test booking through the form
3. Check the terminal for email sending logs
4. Check the customer's email inbox for the confirmation

## Email Features

✅ **Professional HTML Email Template**
- Company branding and styling
- Booking details clearly displayed
- Mobile-responsive design
- Contact information included

✅ **Automatic Sending**
- Sends immediately after booking creation
- Includes booking ID, service details, and total cost
- Graceful error handling (booking still succeeds if email fails)

✅ **Customer Information**
- Personalized with customer name
- Sent to customer's email address
- Includes next steps and expectations

## Troubleshooting

**Email not sending?**
1. Check your Gmail credentials in `.env.local`
2. Ensure 2-Step Verification is enabled
3. Verify the App Password is correct (16 characters, no spaces)
4. Check the terminal logs for error messages

**Gmail Security Issues?**
- Use App Passwords, not your regular Gmail password
- Ensure "Less secure app access" is NOT enabled (use App Passwords instead)
- Check Google Account security notifications

**Environment Variables Not Loading?**
- Restart your development server after changing `.env.local`
- Ensure the file is in the project root directory
- Check for typos in variable names

## Production Deployment

For production, set the same environment variables in your hosting platform:
- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Environment Variables
- Railway: Variables tab in your project
