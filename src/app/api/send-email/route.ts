import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Only initialize Resend if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const createBookingConfirmationEmail = (data: any) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
    <h1 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">Booking Confirmed! 🎉</h1>
    
    <p>Hi ${data.customerName},</p>
    
    <p>Great news! Your bin cleaning service has been booked successfully.</p>
    
    <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #1e40af;">Booking Details:</h3>
      <p><strong>Booking ID:</strong> ${data.bookingId}</p>
      <p><strong>Service Type:</strong> ${data.serviceType.charAt(0).toUpperCase() + data.serviceType.slice(1)} Clean</p>
      <p><strong>Collection Day:</strong> ${data.collectionDay}</p>
      <p><strong>Address:</strong> ${data.address}</p>
      <p><strong>Number of Bins:</strong> ${data.binCount}</p>
      <p><strong>Total Price:</strong> £${data.totalPrice}</p>
    </div>
    
    <p>We'll take care of your bins on your next collection day. Our team will clean them thoroughly and have them sparkling clean for you!</p>
    
    <p>If you have any questions, feel free to reply to this email.</p>
    
    <p>Thank you for choosing our bin cleaning service!</p>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
      <p>This is an automated confirmation email. Please save this for your records.</p>
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
    const body = await request.json();
    const { type, ...emailData } = body;

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

    // Real email sending with Resend (only if API key is configured)
    if (resend && type === 'booking-confirmation') {
      const { data, error } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
        to: emailData.customerEmail,
        subject: `Booking Confirmation - ${emailData.bookingId}`,
        html: createBookingConfirmationEmail(emailData),
      });

      if (error) {
        console.error('Resend error:', error);
        return NextResponse.json({ error: 'Failed to send email', details: error }, { status: 500 });
      }

      return NextResponse.json({ success: true, data });
    }

    if (resend && type === 'admin-notification') {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
      
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

      return NextResponse.json({ success: true, data });
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
