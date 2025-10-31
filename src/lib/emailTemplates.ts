/**
 * EMAIL TEMPLATES
 * ==============
 * Centralized email templates for the bin cleaning service
 * All templates are HTML formatted and can be sent via Gmail SMTP
 */

export interface EmailTemplateData {
  customerName: string;
  customerEmail: string;
  bookingId: string;
  serviceType: string;
  collectionDay: string;
  address: string;
  postcode: string;
  totalPrice: number;
  specialInstructions?: string;
}

/**
 * Booking Confirmation Email
 * Sent when a new booking is created
 */
export const bookingConfirmationTemplate = (data: EmailTemplateData): string => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb; }
      .header { background: #000; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
      .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; }
      .booking-details { background: #f3f4f6; padding: 20px; border-radius: 6px; margin: 20px 0; }
      .detail-row { display: flex; justify-content: space-between; margin: 10px 0; }
      .detail-label { font-weight: 600; color: #6b7280; }
      .detail-value { color: #1f2937; }
      .cta-button { background: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 20px; }
      .footer { color: #9ca3af; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
      h1 { margin: 0 0 10px 0; font-size: 28px; }
      h2 { margin: 20px 0 10px 0; font-size: 18px; color: #000; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>✓ Booking Confirmed!</h1>
        <p>Your bin cleaning booking has been received</p>
      </div>
      <div class="content">
        <p>Hi ${data.customerName},</p>
        <p>Thank you for booking with us! We're excited to help keep your bins fresh and clean.</p>
        
        <h2>Booking Details</h2>
        <div class="booking-details">
          <div class="detail-row">
            <span class="detail-label">Booking ID:</span>
            <span class="detail-value">${data.bookingId}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Service Type:</span>
            <span class="detail-value">${data.serviceType === 'regular' ? 'Regular Cleaning' : 'One-off Clean'}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Collection Day:</span>
            <span class="detail-value">${data.collectionDay}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Service Address:</span>
            <span class="detail-value">${data.address}, ${data.postcode}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Total Price:</span>
            <span class="detail-value" style="font-weight: 600; color: #059669;">£${data.totalPrice}</span>
          </div>
          ${data.specialInstructions ? `
          <div class="detail-row">
            <span class="detail-label">Special Instructions:</span>
            <span class="detail-value">${data.specialInstructions}</span>
          </div>
          ` : ''}
        </div>

        <h2>What's Next?</h2>
        <p>We'll be in touch shortly to confirm the exact time we'll arrive. In the meantime:</p>
        <ul>
          <li>Keep your booking ID (${data.bookingId}) handy for reference</li>
          <li>Make sure your bins are easily accessible on the collection day</li>
          <li>Contact us if anything changes before your booking</li>
        </ul>

        <p style="margin-top: 30px;">Thank you for choosing our service!<br>The Bin Cleaning Team</p>
        
        <div class="footer">
          <p>This is an automated email. Please do not reply directly to this email.</p>
          <p>Questions? Contact us at support@bincleaningservice.com</p>
        </div>
      </div>
    </div>
  </body>
</html>
`;

/**
 * Service Reminder Email
 * Sent to remind customer about upcoming service
 */
export const serviceReminderTemplate = (data: EmailTemplateData): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Service Reminder</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header with accent -->
    <tr>
      <td style="padding: 0;">
        <div style="height: 4px; background: linear-gradient(90deg, #0ea5e9 0%, #3b82f6 100%);"></div>
      </td>
    </tr>
    
    <tr>
      <td style="padding: 40px 24px 24px 24px;">
        <!-- Header -->
        <h1 style="margin: 0 0 8px 0; font-size: 26px; font-weight: 700; color: #1a1a1a; line-height: 1.3; letter-spacing: -0.5px;">
          Service Reminder
        </h1>
        <p style="margin: 0 0 32px 0; font-size: 15px; color: #525252; line-height: 1.6;">
          Your bin cleaning service is scheduled for ${data.collectionDay}.
        </p>

        <!-- Service Details -->
        <div style="margin-bottom: 32px;">
          <h2 style="margin: 0 0 12px 0; font-size: 13px; font-weight: 600; color: #0ea5e9; text-transform: uppercase; letter-spacing: 0.5px;">
            Service Details
          </h2>
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; background-color: #fafafa; border: 1px solid #e5e5e5;">
            <tr>
              <td style="padding: 12px 12px 10px 12px; border-bottom: 1px solid #e5e5e5;">
                <p style="margin: 0 0 3px 0; font-size: 11px; color: #737373; font-weight: 500; text-transform: uppercase; letter-spacing: 0.3px;">Booking ID</p>
                <p style="margin: 0; font-size: 14px; color: #1a1a1a; font-weight: 600;">${data.bookingId}</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; border-bottom: 1px solid #e5e5e5;">
                <p style="margin: 0 0 3px 0; font-size: 11px; color: #737373; font-weight: 500; text-transform: uppercase; letter-spacing: 0.3px;">Service Day</p>
                <p style="margin: 0; font-size: 14px; color: #1a1a1a; font-weight: 500;">${data.collectionDay}</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; border-bottom: 1px solid #e5e5e5;">
                <p style="margin: 0 0 3px 0; font-size: 11px; color: #737373; font-weight: 500; text-transform: uppercase; letter-spacing: 0.3px;">Address</p>
                <p style="margin: 0; font-size: 14px; color: #1a1a1a; font-weight: 500;">${data.address}, ${data.postcode}</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 12px 12px 12px;">
                <p style="margin: 0 0 3px 0; font-size: 11px; color: #737373; font-weight: 500; text-transform: uppercase; letter-spacing: 0.3px;">Service Type</p>
                <p style="margin: 0; font-size: 14px; color: #1a1a1a; font-weight: 500;">${data.serviceType === 'regular' ? 'Regular Cleaning' : 'One-off Clean'}</p>
              </td>
            </tr>
          </table>
        </div>

        <!-- Before We Arrive -->
        <div style="margin-bottom: 32px;">
          <h2 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 600; color: #0ea5e9; text-transform: uppercase; letter-spacing: 0.5px;">
            Before We Arrive
          </h2>
          <div style="padding: 20px; background-color: #f0f9ff; border-left: 3px solid #0ea5e9;">
            <p style="margin: 0 0 12px 0; font-size: 15px; color: #1a1a1a; line-height: 1.6; font-weight: 500;">
              Please ensure your bins are easily accessible.
            </p>
            <p style="margin: 0; font-size: 15px; color: #525252; line-height: 1.6;">
              Check that gates and access points are unlocked if applicable.
            </p>
          </div>
        </div>

        <!-- Help Section -->
        <div style="padding: 20px; background-color: #fafafa; border: 1px solid #e5e5e5;">
          <h3 style="margin: 0 0 8px 0; font-size: 15px; font-weight: 600; color: #1a1a1a;">
            Need to Make Changes?
          </h3>
          <p style="margin: 0 0 12px 0; font-size: 14px; color: #525252; line-height: 1.6;">
            If you need to reschedule or have any questions, we're here to help!
          </p>
          <a href="https://bin-cleaning-service.netlify.app/contact" style="display: inline-block; padding: 8px 16px; background-color: #0ea5e9; color: #ffffff; text-decoration: none; border-radius: 4px; font-size: 13px; font-weight: 500;">
            View Contact Details
          </a>
        </div>

        <!-- Footer -->
        <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #e5e5e5;">
          <p style="margin: 0 0 4px 0; font-size: 15px; color: #1a1a1a; font-weight: 500;">Best regards,</p>
          <p style="margin: 0; font-size: 15px; color: #525252;">Bin Cleaning Service Team</p>
        </div>
      </td>
    </tr>
    
    <!-- Footer accent -->
    <tr>
      <td style="padding: 0;">
        <div style="height: 2px; background-color: #e5e5e5;"></div>
      </td>
    </tr>
  </table>
</body>
</html>
`;

/**
 * Service Completion Email
 * Sent after service is completed
 */
export const serviceCompletionTemplate = (data: EmailTemplateData): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Service Complete</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header with accent -->
    <tr>
      <td style="padding: 0;">
        <div style="height: 4px; background: linear-gradient(90deg, #10b981 0%, #34d399 100%);"></div>
      </td>
    </tr>
    
    <tr>
      <td style="padding: 40px 24px 24px 24px;">
        <!-- Header -->
        <h1 style="margin: 0 0 8px 0; font-size: 26px; font-weight: 700; color: #1a1a1a; line-height: 1.3; letter-spacing: -0.5px;">
          Service Complete
        </h1>
        <p style="margin: 0 0 32px 0; font-size: 15px; color: #525252; line-height: 1.6;">
          Your bin cleaning service has been completed successfully.
        </p>

        <!-- Service Summary -->
        <div style="margin-bottom: 32px;">
          <h2 style="margin: 0 0 12px 0; font-size: 13px; font-weight: 600; color: #10b981; text-transform: uppercase; letter-spacing: 0.5px;">
            Service Summary
          </h2>
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; background-color: #fafafa; border: 1px solid #e5e5e5;">
            <tr>
              <td style="padding: 12px 12px 10px 12px; border-bottom: 1px solid #e5e5e5;">
                <p style="margin: 0 0 3px 0; font-size: 11px; color: #737373; font-weight: 500; text-transform: uppercase; letter-spacing: 0.3px;">Booking ID</p>
                <p style="margin: 0; font-size: 14px; color: #1a1a1a; font-weight: 600;">${data.bookingId}</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; border-bottom: 1px solid #e5e5e5;">
                <p style="margin: 0 0 3px 0; font-size: 11px; color: #737373; font-weight: 500; text-transform: uppercase; letter-spacing: 0.3px;">Service Date</p>
                <p style="margin: 0; font-size: 14px; color: #1a1a1a; font-weight: 500;">${data.collectionDay}</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; border-bottom: 1px solid #e5e5e5;">
                <p style="margin: 0 0 3px 0; font-size: 11px; color: #737373; font-weight: 500; text-transform: uppercase; letter-spacing: 0.3px;">Address</p>
                <p style="margin: 0; font-size: 14px; color: #1a1a1a; font-weight: 500;">${data.address}, ${data.postcode}</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 12px 12px 12px;">
                <p style="margin: 0 0 3px 0; font-size: 11px; color: #737373; font-weight: 500; text-transform: uppercase; letter-spacing: 0.3px;">Service Type</p>
                <p style="margin: 0; font-size: 14px; color: #1a1a1a; font-weight: 500;">${data.serviceType === 'regular' ? 'Regular Cleaning' : 'One-off Clean'}</p>
              </td>
            </tr>
          </table>
        </div>

        <!-- Thank You Message -->
        <div style="margin-bottom: 32px;">
          <h2 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 600; color: #10b981; text-transform: uppercase; letter-spacing: 0.5px;">
            Thank You
          </h2>
          <div style="padding: 20px; background-color: #ecfdf5; border-left: 3px solid #10b981;">
            <p style="margin: 0 0 12px 0; font-size: 15px; color: #1a1a1a; line-height: 1.6; font-weight: 500;">
              Thank you for choosing our service!
            </p>
            <p style="margin: 0; font-size: 15px; color: #525252; line-height: 1.6;">
              ${data.serviceType === 'regular' ? 'We will be back as scheduled for your next cleaning.' : 'We hope to serve you again in the future.'}
            </p>
          </div>
        </div>

        <!-- Help Section -->
        <div style="padding: 20px; background-color: #fafafa; border: 1px solid #e5e5e5;">
          <h3 style="margin: 0 0 8px 0; font-size: 15px; font-weight: 600; color: #1a1a1a;">
            Questions or Feedback?
          </h3>
          <p style="margin: 0 0 12px 0; font-size: 14px; color: #525252; line-height: 1.6;">
            We'd love to hear about your experience! If you have any feedback or concerns, please get in touch.
          </p>
          <a href="https://bin-cleaning-service.netlify.app/contact" style="display: inline-block; padding: 8px 16px; background-color: #10b981; color: #ffffff; text-decoration: none; border-radius: 4px; font-size: 13px; font-weight: 500;">
            View Contact Details
          </a>
        </div>

        <!-- Footer -->
        <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #e5e5e5;">
          <p style="margin: 0 0 4px 0; font-size: 15px; color: #1a1a1a; font-weight: 500;">Best regards,</p>
          <p style="margin: 0; font-size: 15px; color: #525252;">Bin Cleaning Service Team</p>
        </div>
      </td>
    </tr>
    
    <!-- Footer accent -->
    <tr>
      <td style="padding: 0;">
        <div style="height: 2px; background-color: #e5e5e5;"></div>
      </td>
    </tr>
  </table>
</body>
</html>
`;

/**
 * Payment Reminder Email
 * Sent if payment is pending
 */
export const paymentReminderTemplate = (data: EmailTemplateData): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Reminder</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header with accent -->
    <tr>
      <td style="padding: 0;">
        <div style="height: 4px; background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%);"></div>
      </td>
    </tr>
    
    <tr>
      <td style="padding: 40px 24px 24px 24px;">
        <!-- Header -->
        <h1 style="margin: 0 0 8px 0; font-size: 26px; font-weight: 700; color: #1a1a1a; line-height: 1.3; letter-spacing: -0.5px;">
          Payment Reminder
        </h1>
        <p style="margin: 0 0 32px 0; font-size: 15px; color: #525252; line-height: 1.6;">
          Payment is pending for your bin cleaning service.
        </p>

        <!-- Payment Details -->
        <div style="margin-bottom: 32px;">
          <h2 style="margin: 0 0 12px 0; font-size: 13px; font-weight: 600; color: #f59e0b; text-transform: uppercase; letter-spacing: 0.5px;">
            Payment Details
          </h2>
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; background-color: #fafafa; border: 1px solid #e5e5e5;">
            <tr>
              <td style="padding: 12px 12px 10px 12px; border-bottom: 1px solid #e5e5e5;">
                <p style="margin: 0 0 3px 0; font-size: 11px; color: #737373; font-weight: 500; text-transform: uppercase; letter-spacing: 0.3px;">Booking ID</p>
                <p style="margin: 0; font-size: 14px; color: #1a1a1a; font-weight: 600;">${data.bookingId}</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; border-bottom: 1px solid #e5e5e5;">
                <p style="margin: 0 0 3px 0; font-size: 11px; color: #737373; font-weight: 500; text-transform: uppercase; letter-spacing: 0.3px;">Service</p>
                <p style="margin: 0; font-size: 14px; color: #1a1a1a; font-weight: 500;">${data.serviceType === 'regular' ? 'Regular Cleaning' : 'One-off Clean'}</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; border-bottom: 1px solid #e5e5e5;">
                <p style="margin: 0 0 3px 0; font-size: 11px; color: #737373; font-weight: 500; text-transform: uppercase; letter-spacing: 0.3px;">Service Day</p>
                <p style="margin: 0; font-size: 14px; color: #1a1a1a; font-weight: 500;">${data.collectionDay}</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; border-bottom: 1px solid #e5e5e5;">
                <p style="margin: 0 0 3px 0; font-size: 11px; color: #737373; font-weight: 500; text-transform: uppercase; letter-spacing: 0.3px;">Address</p>
                <p style="margin: 0; font-size: 14px; color: #1a1a1a; font-weight: 500;">${data.address}, ${data.postcode}</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 12px 12px 12px;">
                <p style="margin: 0 0 3px 0; font-size: 11px; color: #737373; font-weight: 500; text-transform: uppercase; letter-spacing: 0.3px;">Amount Due</p>
                <p style="margin: 0; font-size: 18px; color: #f59e0b; font-weight: 700;">£${data.totalPrice.toFixed(2)}</p>
              </td>
            </tr>
          </table>
        </div>

        <!-- Payment Instructions -->
        <div style="margin-bottom: 32px;">
          <h2 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 600; color: #f59e0b; text-transform: uppercase; letter-spacing: 0.5px;">
            How to Pay
          </h2>
          <div style="padding: 20px; background-color: #fffbeb; border-left: 3px solid #f59e0b;">
            <p style="margin: 0 0 12px 0; font-size: 15px; color: #1a1a1a; line-height: 1.6; font-weight: 500;">
              Please arrange payment as soon as possible to secure your booking.
            </p>
            <p style="margin: 0; font-size: 15px; color: #525252; line-height: 1.6;">
              Contact us for payment options or pay the cleaner on service day.
            </p>
          </div>
        </div>

        <!-- Help Section -->
        <div style="padding: 20px; background-color: #fafafa; border: 1px solid #e5e5e5;">
          <h3 style="margin: 0 0 8px 0; font-size: 15px; font-weight: 600; color: #1a1a1a;">
            Questions About Payment?
          </h3>
          <p style="margin: 0 0 12px 0; font-size: 14px; color: #525252; line-height: 1.6;">
            If you have any questions or need assistance with payment, please get in touch.
          </p>
          <a href="https://bin-cleaning-service.netlify.app/contact" style="display: inline-block; padding: 8px 16px; background-color: #f59e0b; color: #ffffff; text-decoration: none; border-radius: 4px; font-size: 13px; font-weight: 500;">
            View Contact Details
          </a>
        </div>

        <!-- Footer -->
        <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #e5e5e5;">
          <p style="margin: 0 0 4px 0; font-size: 15px; color: #1a1a1a; font-weight: 500;">Best regards,</p>
          <p style="margin: 0; font-size: 15px; color: #525252;">Bin Cleaning Service Team</p>
        </div>
      </td>
    </tr>
    
    <!-- Footer accent -->
    <tr>
      <td style="padding: 0;">
        <div style="height: 2px; background-color: #e5e5e5;"></div>
      </td>
    </tr>
  </table>
</body>
</html>
`;

/**
 * Cancellation Confirmation Email
 * Sent when a booking is cancelled
 */
export const cancellationTemplate = (data: EmailTemplateData): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Cancelled</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header with accent -->
    <tr>
      <td style="padding: 0;">
        <div style="height: 4px; background: linear-gradient(90deg, #6b7280 0%, #9ca3af 100%);"></div>
      </td>
    </tr>
    
    <tr>
      <td style="padding: 40px 24px 24px 24px;">
        <!-- Header -->
        <h1 style="margin: 0 0 8px 0; font-size: 26px; font-weight: 700; color: #1a1a1a; line-height: 1.3; letter-spacing: -0.5px;">
          Booking Cancelled
        </h1>
        <p style="margin: 0 0 32px 0; font-size: 15px; color: #525252; line-height: 1.6;">
          Your booking has been cancelled.
        </p>

        <!-- Cancellation Details -->
        <div style="margin-bottom: 32px;">
          <h2 style="margin: 0 0 12px 0; font-size: 13px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">
            Cancelled Booking Details
          </h2>
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; background-color: #fafafa; border: 1px solid #e5e5e5;">
            <tr>
              <td style="padding: 12px 12px 10px 12px; border-bottom: 1px solid #e5e5e5;">
                <p style="margin: 0 0 3px 0; font-size: 11px; color: #737373; font-weight: 500; text-transform: uppercase; letter-spacing: 0.3px;">Booking ID</p>
                <p style="margin: 0; font-size: 14px; color: #1a1a1a; font-weight: 600;">${data.bookingId}</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; border-bottom: 1px solid #e5e5e5;">
                <p style="margin: 0 0 3px 0; font-size: 11px; color: #737373; font-weight: 500; text-transform: uppercase; letter-spacing: 0.3px;">Service</p>
                <p style="margin: 0; font-size: 14px; color: #1a1a1a; font-weight: 500;">${data.serviceType === 'regular' ? 'Regular Cleaning' : 'One-off Clean'}</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; border-bottom: 1px solid #e5e5e5;">
                <p style="margin: 0 0 3px 0; font-size: 11px; color: #737373; font-weight: 500; text-transform: uppercase; letter-spacing: 0.3px;">Original Service Day</p>
                <p style="margin: 0; font-size: 14px; color: #1a1a1a; font-weight: 500;">${data.collectionDay}</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 12px 12px 12px;">
                <p style="margin: 0 0 3px 0; font-size: 11px; color: #737373; font-weight: 500; text-transform: uppercase; letter-spacing: 0.3px;">Address</p>
                <p style="margin: 0; font-size: 14px; color: #1a1a1a; font-weight: 500;">${data.address}, ${data.postcode}</p>
              </td>
            </tr>
          </table>
        </div>

        <!-- Important Notice -->
        <div style="margin-bottom: 32px;">
          <h2 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">
            What This Means
          </h2>
          <div style="padding: 20px; background-color: #f9fafb; border-left: 3px solid #6b7280;">
            <p style="margin: 0 0 12px 0; font-size: 15px; color: #1a1a1a; line-height: 1.6; font-weight: 500;">
              Your scheduled bin cleaning service has been cancelled.
            </p>
            <p style="margin: 0; font-size: 15px; color: #525252; line-height: 1.6;">
              If this was unexpected or you'd like to reschedule, please contact us immediately.
            </p>
          </div>
        </div>

        <!-- Help Section -->
        <div style="padding: 20px; background-color: #fafafa; border: 1px solid #e5e5e5;">
          <h3 style="margin: 0 0 8px 0; font-size: 15px; font-weight: 600; color: #1a1a1a;">
            Need to Reschedule?
          </h3>
          <p style="margin: 0 0 12px 0; font-size: 14px; color: #525252; line-height: 1.6;">
            If you'd like to book a new service or have questions about this cancellation, we're here to help.
          </p>
          <a href="https://bin-cleaning-service.netlify.app/contact" style="display: inline-block; padding: 8px 16px; background-color: #6b7280; color: #ffffff; text-decoration: none; border-radius: 4px; font-size: 13px; font-weight: 500;">
            View Contact Details
          </a>
        </div>

        <!-- Footer -->
        <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #e5e5e5;">
          <p style="margin: 0 0 4px 0; font-size: 15px; color: #1a1a1a; font-weight: 500;">Best regards,</p>
          <p style="margin: 0; font-size: 15px; color: #525252;">Bin Cleaning Service Team</p>
        </div>
      </td>
    </tr>
    
    <!-- Footer accent -->
    <tr>
      <td style="padding: 0;">
        <div style="height: 2px; background-color: #e5e5e5;"></div>
      </td>
    </tr>
  </table>
</body>
</html>
`;

/**
 * Abandoned Booking Recovery Email
 * Sent to users who started but didn't complete their booking
 */
export const abandonedBookingTemplate = (data: EmailTemplateData): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Complete Your Booking</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header with accent -->
    <tr>
      <td style="padding: 0;">
        <div style="height: 4px; background: linear-gradient(90deg, #8b5cf6 0%, #a78bfa 100%);"></div>
      </td>
    </tr>
    
    <tr>
      <td style="padding: 40px 24px 24px 24px;">
        <!-- Header -->
        <h1 style="margin: 0 0 8px 0; font-size: 26px; font-weight: 700; color: #1a1a1a; line-height: 1.3; letter-spacing: -0.5px;">
          Complete Your Booking
        </h1>
        <p style="margin: 0 0 32px 0; font-size: 15px; color: #525252; line-height: 1.6;">
          You're just one step away from sparkling clean bins!
        </p>

        <!-- Message Section -->
        <div style="margin-bottom: 32px;">
          <p style="margin: 0 0 16px 0; font-size: 15px; color: #1a1a1a; line-height: 1.6;">
            Hi ${data.customerName},
          </p>
          <p style="margin: 0 0 16px 0; font-size: 15px; color: #525252; line-height: 1.6;">
            We noticed you started booking our bin cleaning service but didn't complete the process. We'd love to help you get your bins cleaned!
          </p>
          <p style="margin: 0; font-size: 15px; color: #525252; line-height: 1.6;">
            Don't miss out on our professional cleaning service for your ${data.postcode} area.
          </p>
        </div>

        <!-- What You'll Get Section -->
        <div style="margin-bottom: 32px;">
          <h2 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 600; color: #8b5cf6; text-transform: uppercase; letter-spacing: 0.5px;">
            What You'll Get
          </h2>
          <div style="padding: 20px; background-color: #faf5ff; border-left: 3px solid #8b5cf6;">
            <p style="margin: 0 0 12px 0; font-size: 15px; color: #1a1a1a; line-height: 1.6; font-weight: 500;">
              ✓ Professional bin cleaning service
            </p>
            <p style="margin: 0 0 12px 0; font-size: 15px; color: #525252; line-height: 1.6;">
              ✓ Eco-friendly cleaning products
            </p>
            <p style="margin: 0 0 12px 0; font-size: 15px; color: #525252; line-height: 1.6;">
              ✓ Scheduled on your collection day
            </p>
            <p style="margin: 0; font-size: 15px; color: #525252; line-height: 1.6;">
              ✓ No hassle, no mess
            </p>
          </div>
        </div>

        <!-- CTA Section -->
        <div style="margin-bottom: 32px; text-align: center; padding: 32px 20px; background-color: #fafafa; border: 1px solid #e5e5e5;">
          <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 700; color: #1a1a1a;">
            Ready to Complete Your Booking?
          </h3>
          <p style="margin: 0 0 24px 0; font-size: 14px; color: #525252; line-height: 1.6;">
            Click the button below to return to the booking page
          </p>
          <a href="https://bin-cleaning-service.netlify.app/" style="display: inline-block; padding: 14px 32px; background-color: #8b5cf6; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 15px; font-weight: 600; letter-spacing: 0.3px;">
            Complete My Booking
          </a>
        </div>

        <!-- Help Section -->
        <div style="padding: 20px; background-color: #fafafa; border: 1px solid #e5e5e5;">
          <h3 style="margin: 0 0 8px 0; font-size: 15px; font-weight: 600; color: #1a1a1a;">
            Need Help?
          </h3>
          <p style="margin: 0 0 12px 0; font-size: 14px; color: #525252; line-height: 1.6;">
            If you have any questions or need assistance completing your booking, we're here to help.
          </p>
          <a href="https://bin-cleaning-service.netlify.app/contact" style="display: inline-block; padding: 8px 16px; background-color: #8b5cf6; color: #ffffff; text-decoration: none; border-radius: 4px; font-size: 13px; font-weight: 500;">
            View Contact Details
          </a>
        </div>

        <!-- Footer -->
        <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #e5e5e5;">
          <p style="margin: 0 0 4px 0; font-size: 15px; color: #1a1a1a; font-weight: 500;">Best regards,</p>
          <p style="margin: 0; font-size: 15px; color: #525252;">Bin Cleaning Service Team</p>
        </div>
      </td>
    </tr>
    
    <!-- Footer accent -->
    <tr>
      <td style="padding: 0;">
        <div style="height: 2px; background-color: #e5e5e5;"></div>
      </td>
    </tr>
  </table>
</body>
</html>
`;

/**
 * Get email template by type
 */
export const getEmailTemplate = (
  templateType: 'booking-confirmation' | 'service-reminder' | 'service-completion' | 'payment-reminder' | 'cancellation' | 'abandoned-booking',
  data: EmailTemplateData
): { subject: string; html: string } => {
  const templates: Record<string, { subject: string; html: string }> = {
    'booking-confirmation': {
      subject: `Booking Confirmed - ID: ${data.bookingId}`,
      html: bookingConfirmationTemplate(data)
    },
    'service-reminder': {
      subject: `Reminder: Your bin cleaning is ${data.collectionDay}`,
      html: serviceReminderTemplate(data)
    },
    'service-completion': {
      subject: `Service Complete - ID: ${data.bookingId}`,
      html: serviceCompletionTemplate(data)
    },
    'payment-reminder': {
      subject: `Payment Reminder - ID: ${data.bookingId}`,
      html: paymentReminderTemplate(data)
    },
    'cancellation': {
      subject: `Booking Cancelled - ID: ${data.bookingId}`,
      html: cancellationTemplate(data)
    },
    'abandoned-booking': {
      subject: `Complete Your Bin Cleaning Booking`,
      html: abandonedBookingTemplate(data)
    }
  };

  return templates[templateType] || templates['booking-confirmation'];
};
