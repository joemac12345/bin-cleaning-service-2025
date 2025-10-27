# Gmail SMTP Setup Guide

This guide will help you set up Gmail SMTP for sending emails from your bin cleaning service application.

## 📧 **Step 1: Enable 2-Factor Authentication**

1. Go to your Google Account settings: https://myaccount.google.com/
2. Navigate to **Security**
3. Turn on **2-Step Verification** if not already enabled

## 🔑 **Step 2: Generate App Password**

1. In Google Account Security, scroll to **2-Step Verification**
2. At the bottom, click **App passwords**
3. Select **Mail** as the app and **Other** as the device
4. Enter "Bin Cleaning Service" as the device name
5. Click **Generate**
6. **Save the 16-character password** - you'll need this for the environment variables

## ⚙️ **Step 3: Configure Environment Variables**

Add these to your **Netlify environment variables** (not local .env):

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
