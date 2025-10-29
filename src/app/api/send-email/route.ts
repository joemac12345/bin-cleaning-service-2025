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
        const db = new DatabaseStorage();
        const bookings = await db.getAllBookings();
        const booking = bookings.find((b: any) => b.id === bookingId);

        if (!booking) {
          return NextResponse.json(
            { error: `Booking not found: ${bookingId}`, success: false },
            { status: 404 }
          );
        }

        // Prepare email data
        const emailTemplateData: EmailTemplateData = {
          customerName: booking.customerName || 'Valued Customer',
          customerEmail: booking.customerEmail,
          bookingId: booking.id,
          serviceType: booking.serviceType || 'regular',
          collectionDay: booking.collectionDay || 'Soon',
          address: booking.address || '',
          postcode: booking.postcode || '',
          totalPrice: booking.totalPrice || 0,
          specialInstructions: booking.specialInstructions || undefined
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
          booking.customerEmail,
          subject,
          html,
          process.env.GMAIL_USER || 'noreply@bincleaningservice.com'
        );

        if (result.success) {
          return NextResponse.json({
            success: true,
            messageId: result.messageId,
            message: `Email sent successfully to ${booking.customerEmail}`,
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
      error: 'Invalid email type. Use "booking-confirmation", "admin-notification", or "admin-send"',
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
