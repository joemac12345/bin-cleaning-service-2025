import { NextRequest, NextResponse } from 'next/server';
import { sendEmailViaGmail } from '@/lib/gmail-sender';
import { createBookingConfirmationEmail, createAdminNotificationEmail } from '@/lib/email-templates';

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

// Email templates are now imported from separate files

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
