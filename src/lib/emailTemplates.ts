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
<html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb; }
      .header { background: #0ea5e9; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
      .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; }
      .reminder-box { background: #e0f2fe; border-left: 4px solid #0ea5e9; padding: 20px; border-radius: 4px; margin: 20px 0; }
      .footer { color: #9ca3af; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
      h1 { margin: 0 0 10px 0; font-size: 28px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>📋 Service Reminder</h1>
        <p>Your bin cleaning is coming up!</p>
      </div>
      <div class="content">
        <p>Hi ${data.customerName},</p>
        
        <div class="reminder-box">
          <p><strong>Don't forget!</strong> Your bin cleaning service is scheduled for <strong>${data.collectionDay}</strong>.</p>
          <p>Booking ID: <strong>${data.bookingId}</strong></p>
        </div>

        <h2>Before We Arrive</h2>
        <ul>
          <li>Ensure your bins are easily accessible</li>
          <li>Check that gates/access points are unlocked if applicable</li>
          <li>If you have any special instructions, ensure they're followed</li>
          <li>Have the correct amount ready if paying by cash</li>
        </ul>

        <h2>Need to Make Changes?</h2>
        <p>If you need to reschedule or have any questions, please contact us as soon as possible.</p>

        <p style="margin-top: 30px;">We look forward to serving you!<br>The Bin Cleaning Team</p>
        
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
 * Service Completion Email
 * Sent after service is completed
 */
export const serviceCompletionTemplate = (data: EmailTemplateData): string => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb; }
      .header { background: #10b981; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
      .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; }
      .success-box { background: #d1fae5; border-left: 4px solid #10b981; padding: 20px; border-radius: 4px; margin: 20px 0; }
      .footer { color: #9ca3af; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
      h1 { margin: 0 0 10px 0; font-size: 28px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>✨ Service Complete!</h1>
        <p>Your bins have been cleaned</p>
      </div>
      <div class="content">
        <p>Hi ${data.customerName},</p>
        
        <div class="success-box">
          <p><strong>Great news!</strong> Your bin cleaning service has been completed successfully.</p>
          <p>Booking ID: <strong>${data.bookingId}</strong></p>
        </div>

        <h2>Service Summary</h2>
        <p>We've completed the cleaning of your bins on <strong>${data.collectionDay}</strong> at <strong>${data.address}, ${data.postcode}</strong>.</p>

        <h2>What Now?</h2>
        <p>If you booked a one-off service, thank you for choosing us! If you'd like to schedule another cleaning, just let us know.</p>
        <p>For regular services, we'll be back as scheduled.</p>

        <h2>Feedback</h2>
        <p>We'd love to hear about your experience! If you have any feedback or concerns, please don't hesitate to contact us.</p>

        <p style="margin-top: 30px;">Thank you for your business!<br>The Bin Cleaning Team</p>
        
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
 * Payment Reminder Email
 * Sent if payment is pending
 */
export const paymentReminderTemplate = (data: EmailTemplateData): string => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb; }
      .header { background: #f59e0b; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
      .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; }
      .payment-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 4px; margin: 20px 0; }
      .amount { font-size: 24px; font-weight: 600; color: #92400e; }
      .footer { color: #9ca3af; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
      h1 { margin: 0 0 10px 0; font-size: 28px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>💳 Payment Reminder</h1>
        <p>Payment required for your bin cleaning service</p>
      </div>
      <div class="content">
        <p>Hi ${data.customerName},</p>
        
        <div class="payment-box">
          <p>Payment is still pending for your booking.</p>
          <p>Booking ID: <strong>${data.bookingId}</strong></p>
          <p style="margin-top: 15px;">Amount due: <span class="amount">£${data.totalPrice}</span></p>
        </div>

        <h2>Booking Details</h2>
        <ul>
          <li><strong>Service:</strong> ${data.serviceType === 'regular' ? 'Regular Cleaning' : 'One-off Clean'}</li>
          <li><strong>Collection Day:</strong> ${data.collectionDay}</li>
          <li><strong>Address:</strong> ${data.address}, ${data.postcode}</li>
        </ul>

        <h2>How to Pay</h2>
        <p>Please arrange payment as soon as possible to secure your booking:</p>
        <ul>
          <li>📱 Bank Transfer: Contact us for our bank details</li>
          <li>💳 Card Payment: Pay online through our secure portal</li>
          <li>💵 Cash: Pay the cleaner on service day</li>
        </ul>

        <p style="margin-top: 30px;">Questions? Please contact us.<br>The Bin Cleaning Team</p>
        
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
 * Cancellation Confirmation Email
 * Sent when a booking is cancelled
 */
export const cancellationTemplate = (data: EmailTemplateData): string => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb; }
      .header { background: #ef4444; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
      .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; }
      .cancel-box { background: #fee2e2; border-left: 4px solid #ef4444; padding: 20px; border-radius: 4px; margin: 20px 0; }
      .footer { color: #9ca3af; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
      h1 { margin: 0 0 10px 0; font-size: 28px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>✗ Booking Cancelled</h1>
        <p>Your booking has been cancelled</p>
      </div>
      <div class="content">
        <p>Hi ${data.customerName},</p>
        
        <div class="cancel-box">
          <p>Your booking has been cancelled.</p>
          <p>Booking ID: <strong>${data.bookingId}</strong></p>
          <p>Date: <strong>${data.collectionDay}</strong></p>
        </div>

        <h2>What This Means</h2>
        <p>Your scheduled bin cleaning service on ${data.collectionDay} has been cancelled. If this was unexpected, please contact us immediately.</p>

        <h2>Need Help?</h2>
        <p>If you'd like to reschedule or have any questions about this cancellation, please don't hesitate to reach out.</p>

        <p style="margin-top: 30px;">Thank you for understanding.<br>The Bin Cleaning Team</p>
        
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
 * Get email template by type
 */
export const getEmailTemplate = (
  templateType: 'booking-confirmation' | 'service-reminder' | 'service-completion' | 'payment-reminder' | 'cancellation',
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
    }
  };

  return templates[templateType] || templates['booking-confirmation'];
};
