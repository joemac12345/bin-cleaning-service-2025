import { NextRequest, NextResponse } from 'next/server';
import { sendEmailViaGmail } from '@/lib/gmail-sender';
import { createBookingConfirmationEmail, createAdminNotificationEmail } from '@/lib/email-templates';
import { getEmailTemplate, EmailTemplateData } from '@/lib/emailTemplates';
import { DatabaseStorage } from '@/lib/supabaseStorage';

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
    const { type, bookingId, templateType, customMessage, ...emailData } = body;

    console.log('📝 Request details:', { 
      type,
      templateType,
      bookingId, 
      customerEmail: emailData.customerEmail,
      hasGmailConfig: isGmailConfigured()
    });

    // NEW: Admin email sending with templates
    if (type === 'admin-send') {
      if (!bookingId || !templateType) {
        return NextResponse.json(
          { error: 'Missing required fields: bookingId and templateType', success: false },
          { status: 400 }
        );
      }

      // Validate template type
      const validTemplates = ['booking-confirmation', 'service-reminder', 'service-completion', 'payment-reminder', 'cancellation'];
      if (!validTemplates.includes(templateType)) {
        return NextResponse.json(
          { error: `Invalid templateType. Must be one of: ${validTemplates.join(', ')}`, success: false },
          { status: 400 }
        );
      }

      try {
        // Retrieve booking from database
        const bookings = await DatabaseStorage.getBookings();
        console.log('📚 Total bookings in database:', bookings.length);
        
        const booking = bookings.find((b: any) => b.id === bookingId || b.bookingId === bookingId || b.booking_id === bookingId);

        if (!booking) {
          console.error('❌ Booking not found. Looking for ID:', bookingId);
          console.error('📚 Available booking IDs:', bookings.map((b: any) => ({
            id: b.id,
            bookingId: b.bookingId,
            booking_id: b.booking_id
          })));
          return NextResponse.json(
            { error: `Booking not found: ${bookingId}`, success: false },
            { status: 404 }
          );
        }

        console.log('📋 Found booking:', {
          id: booking.id,
          bookingId: booking.bookingId,
          booking_id: booking.booking_id,
          hasCustomerInfo: !!booking.customerInfo,
          hasCustomer_info: !!booking.customer_info
        });

        // Extract customer info - handle both nested and flat structures
        const customerInfo = booking.customerInfo || booking.customer_info || {};
        const firstName = customerInfo.firstName || booking.firstName || '';
        const lastName = customerInfo.lastName || booking.lastName || '';
        const email = customerInfo.email || booking.email || booking.customerEmail || '';
        const address = customerInfo.address || booking.address || '';
        const postcode = customerInfo.postcode || booking.postcode || '';

        console.log('👤 Customer info extracted:', { firstName, lastName, email, address, postcode });

        if (!email) {
          console.error('❌ No email found. Full booking object:', JSON.stringify(booking, null, 2));
          return NextResponse.json(
            { error: `No email found for booking: ${bookingId}`, success: false },
            { status: 400 }
          );
        }

        // Prepare email data
        const emailTemplateData: EmailTemplateData = {
          customerName: `${firstName} ${lastName}`.trim() || 'Valued Customer',
          customerEmail: email,
          bookingId: booking.id || booking.bookingId || booking.booking_id,
          serviceType: booking.serviceType || booking.service_type || 'regular',
          collectionDay: booking.collectionDay || booking.collection_day || 'Soon',
          address: address,
          postcode: postcode,
          totalPrice: booking.totalPrice || booking.pricing?.totalPrice || 0,
          specialInstructions: booking.specialInstructions || booking.special_instructions || undefined
        };

        // Get email template
        let { subject, html } = getEmailTemplate(templateType as any, emailTemplateData);

        // Add custom message if provided
        if (customMessage) {
          const customMessageHtml = `
          <div style="background: #e0f2fe; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 4px; margin: 20px 0;">
            <p><strong>Message from our team:</strong></p>
            <p>${customMessage.replace(/\n/g, '<br>')}</p>
          </div>
          `;
          const footerIndex = html.indexOf('<div class="footer">');
          if (footerIndex > -1) {
            html = html.slice(0, footerIndex) + customMessageHtml + html.slice(footerIndex);
          }
        }

        // Send email
        const result = await sendEmailViaGmail(
          email,
          subject,
          html,
          process.env.GMAIL_USER || 'noreply@bincleaningservice.com'
        );

        if (result.success) {
          return NextResponse.json({
            success: true,
            messageId: result.messageId,
            message: `Email sent successfully to ${email}`,
            simulation: result.simulation,
            service: 'gmail'
          });
        } else {
          return NextResponse.json(
            { error: `Failed to send email: ${result.error}`, success: false },
            { status: 500 }
          );
        }
      } catch (error) {
        console.error('Error sending admin email:', error);
        return NextResponse.json(
          { error: `Server error: ${error instanceof Error ? error.message : 'Unknown error'}`, success: false },
          { status: 500 }
        );
      }
    }

    // Check if Gmail is configured
    if (!isGmailConfigured()) {
      console.log('❌ Gmail SMTP not configured');
      return NextResponse.json({ 
        error: 'Gmail SMTP not configured. Please set GMAIL_USER and GMAIL_APP_PASS environment variables.',
        success: false
      }, { status: 500 });
    }

    // Preview/Test email - send any HTML directly
    if (type === 'preview') {
      console.log('📧 Sending preview/test email via Gmail...');
      
      const { to, subject, html } = body;
      
      if (!to || !subject || !html) {
        return NextResponse.json({ 
          error: 'Missing required fields: to, subject, html',
          success: false 
        }, { status: 400 });
      }
      
      const result = await sendEmailViaGmail(
        to,
        subject,
        html,
        process.env.GMAIL_USER
      );
      
      console.log('✅ Preview email result:', result);
      return NextResponse.json({ ...result, service: 'gmail' });
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
      error: 'Invalid email type. Use "booking-confirmation", "admin-notification", "admin-send", or "preview"',
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

/**
 * GET endpoint to list available email templates
 */
export async function GET() {
  const templates = [
    {
      id: 'booking-confirmation',
      name: 'Booking Confirmation',
      description: 'Sent when a new booking is created'
    },
    {
      id: 'service-reminder',
      name: 'Service Reminder',
      description: 'Reminder before the scheduled service'
    },
    {
      id: 'service-completion',
      name: 'Service Completion',
      description: 'Sent after the service is completed'
    },
    {
      id: 'payment-reminder',
      name: 'Payment Reminder',
      description: 'Reminder about pending payment'
    },
    {
      id: 'cancellation',
      name: 'Cancellation Confirmation',
      description: 'Sent when a booking is cancelled'
    }
  ];

  return NextResponse.json({
    success: true,
    templates
  });
}
