import { NextRequest, NextResponse } from 'next/server';
import { sendEmailViaGmail } from '@/lib/gmail-sender';

// Gmail SMTP service check
const isGmailConfigured = () => {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPassword = process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_APP_PASS;
  
  if (gmailUser && gmailPassword) {
    console.log('✅ Gmail SMTP service configured');
    return true;
  }
  
  console.log('❌ Gmail not configured - please set GMAIL_USER and GMAIL_APP_PASS');
  return false;
};

const createBookingConfirmationEmail = (data: any) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation - Bin Cleaning Service</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; background-color: #f8fafc; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #1e40af; font-size: 24px; margin: 0; font-weight: 600;">🧽 Bin Cleaning Service</h1>
      <p style="color: #059669; font-size: 18px; font-weight: 600; margin: 10px 0 0 0;">Booking Confirmed!</p>
    </div>
    
    <p style="font-size: 16px; margin-bottom: 20px;">Dear ${data.customerName},</p>
    
    <p style="font-size: 16px; margin-bottom: 25px;">Thank you for booking our professional bin cleaning service. We have received your booking and it has been confirmed.</p>
    
    <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #0ea5e9; margin: 25px 0;">
      <h3 style="color: #0c4a6e; margin: 0 0 15px 0; font-size: 18px;">📋 Booking Details</h3>
      <p style="margin: 5px 0; font-size: 15px;"><strong>Booking ID:</strong> ${data.bookingId}</p>
      <p style="margin: 5px 0; font-size: 15px;"><strong>Service:</strong> ${data.serviceType}</p>
      <p style="margin: 5px 0; font-size: 15px;"><strong>Address:</strong> ${data.address}, ${data.postcode}</p>
      <p style="margin: 5px 0; font-size: 15px;"><strong>Phone:</strong> ${data.phone}</p>
      <p style="margin: 5px 0; font-size: 15px;"><strong>Contact Permission:</strong> ${data.contactPermission === 'yes' ? 'Yes, you may contact me' : 'Please do not contact me'}</p>
    </div>
    
    <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 25px 0;">
      <h3 style="color: #065f46; margin: 0 0 10px 0; font-size: 16px;">✅ What happens next?</h3>
      <ul style="margin: 0; padding-left: 20px; color: #064e3b;">
        <li style="margin-bottom: 8px;">We'll review your booking and confirm availability</li>
        <li style="margin-bottom: 8px;">You'll receive a follow-up call or message within 24 hours</li>
        <li style="margin-bottom: 8px;">We'll schedule your bin cleaning service at a convenient time</li>
      </ul>
    </div>
    
    <div style="text-align: center; margin: 30px 0 20px 0;">
      <p style="font-size: 14px; color: #6b7280; margin: 0;">Need to make changes or have questions?</p>
      <p style="font-size: 14px; color: #6b7280; margin: 5px 0 0 0;">Reply to this email or contact us directly.</p>
    </div>
    
    <div style="text-align: center; padding: 20px 0; border-top: 1px solid #e5e7eb;">
      <p style="font-size: 14px; color: #9ca3af; margin: 0;">Thank you for choosing our bin cleaning service!</p>
    </div>
  </div>
</body>
</html>
`;

const createAdminNotificationEmail = (data: any) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Booking - Admin Notification</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; background-color: #f8fafc; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #dc2626; font-size: 24px; margin: 0; font-weight: 600;">🔔 New Booking Alert</h1>
      <p style="color: #7c2d12; font-size: 16px; margin: 10px 0 0 0;">Admin Notification</p>
    </div>
    
    <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; border-left: 4px solid #ef4444; margin: 25px 0;">
      <h3 style="color: #991b1b; margin: 0 0 15px 0; font-size: 18px;">📋 Booking Details</h3>
      <p style="margin: 5px 0; font-size: 15px;"><strong>Booking ID:</strong> ${data.bookingId}</p>
      <p style="margin: 5px 0; font-size: 15px;"><strong>Customer:</strong> ${data.customerName}</p>
      <p style="margin: 5px 0; font-size: 15px;"><strong>Email:</strong> ${data.customerEmail}</p>
      <p style="margin: 5px 0; font-size: 15px;"><strong>Phone:</strong> ${data.phone}</p>
      <p style="margin: 5px 0; font-size: 15px;"><strong>Service:</strong> ${data.serviceType}</p>
      <p style="margin: 5px 0; font-size: 15px;"><strong>Address:</strong> ${data.address}, ${data.postcode}</p>
      <p style="margin: 5px 0; font-size: 15px;"><strong>Contact Permission:</strong> ${data.contactPermission === 'yes' ? 'Yes, may contact' : 'Do not contact'}</p>
      <p style="margin: 5px 0; font-size: 15px;"><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
    </div>
    
    <div style="background-color: #fffbeb; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 25px 0;">
      <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px;">⚡ Action Required</h3>
      <ul style="margin: 0; padding-left: 20px; color: #78350f;">
        <li style="margin-bottom: 8px;">Review booking details for accuracy</li>
        <li style="margin-bottom: 8px;">Check service availability for the area</li>
        <li style="margin-bottom: 8px;">Contact customer within 24 hours</li>
        <li style="margin-bottom: 8px;">Update booking status in admin panel</li>
      </ul>
    </div>
  </div>
</body>
</html>
`;

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Gmail-only email service started');
    const body = await request.json();
    const { type, ...emailData } = body;

    console.log('📝 Request details:', { 
      type, 
      customerEmail: emailData.customerEmail,
      hasGmailConfig: isGmailConfigured()
    });

    // Check if Gmail is configured
    if (!isGmailConfigured()) {
      console.log('❌ Gmail SMTP not configured');
      return NextResponse.json({ 
        error: 'Gmail SMTP not configured. Please set GMAIL_USER and GMAIL_APP_PASS environment variables.',
        success: false
      }, { status: 500 });
    }

    // Send booking confirmation email
    if (type === 'booking-confirmation') {
      console.log('📧 Sending customer confirmation email via Gmail...');
      
      const result = await sendEmailViaGmail(
        emailData.customerEmail,
        `🧽 Booking Confirmed - ${emailData.bookingId}`,
        createBookingConfirmationEmail(emailData),
        process.env.GMAIL_USER
      );
      
      console.log('✅ Customer email result:', result);
      return NextResponse.json({ ...result, service: 'gmail' });
    }

    // Send admin notification email  
    if (type === 'admin-notification') {
      const adminEmail = process.env.ADMIN_EMAIL || process.env.GMAIL_USER || 'admin@example.com';
      console.log('📧 Sending admin notification via Gmail...');
      
      const result = await sendEmailViaGmail(
        adminEmail,
        `🔔 New Booking: ${emailData.bookingId}`,
        createAdminNotificationEmail(emailData),
        process.env.GMAIL_USER
      );
      
      console.log('✅ Admin email result:', result);
      return NextResponse.json({ ...result, service: 'gmail' });
    }

    return NextResponse.json({ 
      error: 'Invalid email type. Use "booking-confirmation" or "admin-notification"',
      success: false 
    }, { status: 400 });

  } catch (error) {
    console.error('❌ Gmail email service error:', error);
    return NextResponse.json({ 
      error: 'Failed to send email via Gmail SMTP', 
      message: error instanceof Error ? error.message : 'Unknown error',
      success: false
    }, { status: 500 });
  }
}
