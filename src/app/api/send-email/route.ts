import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { sendEmailViaGmail } from '@/lib/gmail-sender';

// Only initialize Resend if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Determine which email service to use based on environment
const getEmailService = () => {
  // Prefer Gmail SMTP if configured (it's free!)
  const gmailUser = process.env.GMAIL_USER;
  const gmailPassword = process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_APP_PASS;
  
  if (gmailUser && gmailPassword) {
    console.log('Using Gmail SMTP service');
    return 'gmail';
  }
  
  // Fall back to Resend if configured
  if (process.env.RESEND_API_KEY) {
    console.log('Falling back to Resend service');
    return 'resend';
  }
  
  console.log('No email service configured');
  // No email service configured
  return null;
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
    ${data.testingMode ? `
    <div style="background-color: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
      <p style="color: #92400e; font-weight: 600; margin: 0; text-align: center;">
        🧪 TESTING MODE: This email was sent to ${data.customerEmail} instead of ${data.originalCustomerEmail}
      </p>
    </div>
    ` : ''}
    
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #1e40af; font-size: 24px; margin: 0; font-weight: 600;">🧽 Bin Cleaning Service</h1>
      <p style="color: #059669; font-size: 18px; font-weight: 600; margin: 10px 0 0 0;">Booking Confirmed!</p>
    </div>
    
    <p style="font-size: 16px; margin-bottom: 20px;">Dear ${data.customerName},</p>
    
    <p style="font-size: 16px; margin-bottom: 25px;">Thank you for booking our professional bin cleaning service. We have received your booking and it has been confirmed.</p>
    
    <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #1e40af;">Booking Details:</h3>
      <p><strong>Booking ID:</strong> ${data.bookingId}</p>
      <p><strong>Service Type:</strong> ${data.serviceType.charAt(0).toUpperCase() + data.serviceType.slice(1)} Clean</p>
      <p><strong>Collection Day:</strong> ${data.collectionDay}</p>
      <p><strong>Address:</strong> ${data.address}</p>
      ${data.testingMode && data.originalCustomerEmail ? `<p><strong>Customer Email:</strong> ${data.originalCustomerEmail}</p>` : ''}
      <p><strong>Number of Bins:</strong> ${data.binCount}</p>
      <p><strong>Total Price:</strong> £${data.totalPrice}</p>
    </div>
    
    <p>We'll take care of your bins on your next collection day. Our team will clean them thoroughly and have them sparkling clean for you!</p>
    
    <p>If you have any questions, feel free to reply to this email.</p>
    
    <p>Thank you for choosing our bin cleaning service!</p>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; text-align: center;">
      <p style="margin: 5px 0;">This is an automated confirmation email for your bin cleaning service booking.</p>
      <p style="margin: 5px 0;">Please save this email for your records.</p>
      <p style="margin: 5px 0;">If you have questions, reply to this email or contact us directly.</p>
      <p style="margin: 10px 0 0 0; font-size: 11px; color: #9ca3af;">
        Bin Cleaning Service | Professional wheelie bin cleaning<br>
        You received this email because you booked a service with us.
      </p>
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
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
    <h1 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">🔔 New Booking Alert</h1>
    
    <p>A new bin cleaning service has been booked:</p>
    
    <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
      <h3 style="margin-top: 0; color: #b91c1c;">Booking Information:</h3>
      <p><strong>Customer:</strong> ${data.customerName} (${data.customerEmail})</p>
      <p><strong>Booking ID:</strong> ${data.bookingId}</p>
      <p><strong>Service:</strong> ${data.serviceType.charAt(0).toUpperCase() + data.serviceType.slice(1)} Clean</p>
      <p><strong>Collection Day:</strong> ${data.collectionDay}</p>
      <p><strong>Address:</strong> ${data.address}</p>
      <p><strong>Bins:</strong> ${data.binCount}</p>
      <p><strong>Total:</strong> £${data.totalPrice}</p>
      <p><strong>Booked:</strong> ${new Date(data.createdAt).toLocaleString()}</p>
    </div>
    
    <p style="background-color: #fffbeb; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
      <strong>Action Required:</strong> Please schedule this service and confirm the collection day with the customer.
    </p>
  </div>
</body>
</html>
`;

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Email API endpoint called');
    const body = await request.json();
    const { type, ...emailData } = body;

    const emailService = getEmailService();
    console.log('📝 Request details:', { type, customerEmail: emailData.customerEmail, emailService });
    console.log('🔧 Environment check:', {
      emailService,
      hasResendKey: !!process.env.RESEND_API_KEY,
      hasGmailUser: !!process.env.GMAIL_USER,
      hasGmailAppPassword: !!process.env.GMAIL_APP_PASSWORD,
      hasGmailAppPass: !!process.env.GMAIL_APP_PASS,
      hasGmailConfig: !!(process.env.GMAIL_USER && (process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_APP_PASS)),
      fromEmail: process.env.RESEND_FROM_EMAIL,
      resendInitialized: !!resend,
      gmailUser: process.env.GMAIL_USER
    });

    // If no Resend API key, simulate email sending
    if (!resend) {
      console.log('📧 EMAIL SIMULATION MODE (No Resend API key configured)');
      console.log('Email Type:', type);
      console.log('Email Data:', emailData);
      
      // Simulate different email types
      if (type === 'booking-confirmation') {
        console.log('✅ Simulated booking confirmation email sent to:', emailData.customerEmail);
        return NextResponse.json({ 
          success: true, 
          message: 'Email simulated successfully (configure RESEND_API_KEY for real delivery)',
          simulation: true,
          emailData 
        });
      } else if (type === 'admin-notification') {
        console.log('🔔 Simulated admin notification email sent to: admin@example.com');
        return NextResponse.json({ 
          success: true, 
          message: 'Admin notification simulated successfully',
          simulation: true,
          emailData 
        });
      }
    }

    // Send booking confirmation email
    if (type === 'booking-confirmation') {
      console.log('📧 Sending customer confirmation email...');
      
      if (emailService === 'gmail') {
        console.log('Using Gmail SMTP service');
        const result = await sendEmailViaGmail(
          emailData.customerEmail,
          `🧽 Booking Confirmed - ${emailData.bookingId}`,
          createBookingConfirmationEmail(emailData),
          process.env.GMAIL_USER
        );
        return NextResponse.json({ ...result, service: 'gmail' });
      } 
      
      if (emailService === 'resend' && resend) {
        console.log('Using Resend service');
        
        // Handle Resend testing mode limitation
        const verifiedTestEmail = 'eyeline65@gmail.com';
        const originalEmail = emailData.customerEmail;
        const isTestMode = !process.env.RESEND_DOMAIN_VERIFIED || process.env.RESEND_DOMAIN_VERIFIED !== 'true';
        const emailToSend = isTestMode ? verifiedTestEmail : originalEmail;
        
        console.log('🔍 Resend configuration:', {
          originalEmail,
          emailToSend,
          isTestMode,
          domainVerified: process.env.RESEND_DOMAIN_VERIFIED
        });
        
        // Add test mode notification to email content if needed
        let emailContent = createBookingConfirmationEmail(emailData);
        if (isTestMode && originalEmail !== verifiedTestEmail) {
          const testModeNotice = `
            <div style="background-color: #fef3c7; padding: 15px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #f59e0b;">
              <strong>⚠️ Test Mode Notice:</strong> This email was originally intended for <strong>${originalEmail}</strong> but sent to your verified address due to Resend testing limitations.
            </div>
          `;
          emailContent = emailContent.replace('</body>', testModeNotice + '</body>');
        }
        
        const { data, error } = await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
          to: emailToSend,
          subject: `🧽 Booking Confirmed - ${emailData.bookingId}${isTestMode && originalEmail !== verifiedTestEmail ? ' (TEST MODE)' : ''}`,
          html: emailContent,
          replyTo: process.env.ADMIN_EMAIL || 'eyeline65@gmail.com'
        });

        if (error) {
          console.error('❌ Resend customer email error:', error);
          return NextResponse.json({ 
            error: 'Failed to send email', 
            details: error, 
            suggestion: 'Verify domain at resend.com/domains to send to any email address'
          }, { status: 500 });
        }

        console.log('✅ Customer confirmation email sent successfully:', data);
        return NextResponse.json({ 
          success: true, 
          service: 'resend', 
          data,
          testMode: isTestMode,
          originalEmail,
          sentToEmail: emailToSend
        });
      }
    }

    if (type === 'admin-notification') {
      const adminEmail = process.env.ADMIN_EMAIL || 'eyeline65@gmail.com';
      
      if (emailService === 'gmail') {
        console.log('Sending admin notification via Gmail');
        const result = await sendEmailViaGmail(
          adminEmail,
          `🔔 New Booking: ${emailData.bookingId}`,
          createAdminNotificationEmail(emailData)
        );
        return NextResponse.json({ ...result, service: 'gmail' });
      }
      
      if (emailService === 'resend' && resend) {
        console.log('Sending admin notification via Resend');
        const { data, error } = await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
          to: adminEmail,
          subject: `New Booking: ${emailData.bookingId}`,
          html: createAdminNotificationEmail(emailData),
        });

        if (error) {
          console.error('Resend error:', error);
          return NextResponse.json({ error: 'Failed to send admin notification', details: error }, { status: 500 });
        }

        return NextResponse.json({ success: true, service: 'resend', data });
      }
    }

    return NextResponse.json({ error: 'Invalid email type' }, { status: 400 });

  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
