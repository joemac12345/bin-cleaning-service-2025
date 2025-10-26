# Vercel Environment Variables Setup

## To configure email functionality, you need to set these environment variables in Vercel:

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project: mobile-bin-cleaning-pro
3. Go to Settings → Environment Variables
4. Add the following variables:

### Email Configuration (Required for sending booking confirmations)
```
GMAIL_EMAIL=nearbuy7@gmail.com
GMAIL_APP_PASSWORD=uygl posv htbp ofkd
```

### Company Details
```
COMPANY_NAME=Bin Cleaning Service
COMPANY_EMAIL=support@bincleaningservice.com
COMPANY_PHONE=+44 123 456 7890
COMPANY_WEBSITE=www.bincleaningservice.com
```

## After adding these variables:
1. Redeploy your application (Vercel will do this automatically)
2. Test the functionality by creating a booking
3. Check the test endpoint: https://mobile-bin-cleaning-pro.vercel.app/api/test

## Debugging Steps:
1. Check the test API: `curl https://mobile-bin-cleaning-pro.vercel.app/api/test`
2. Clear all data: `curl -X DELETE "https://mobile-bin-cleaning-pro.vercel.app/api/bookings?clearAll=true"`
3. Check bookings: `curl https://mobile-bin-cleaning-pro.vercel.app/api/bookings`

## Gmail App Password Setup (if needed):
1. Go to Google Account settings
2. Enable 2-factor authentication
3. Generate an App Password for "Mail"
4. Use that password (not your regular Gmail password)
