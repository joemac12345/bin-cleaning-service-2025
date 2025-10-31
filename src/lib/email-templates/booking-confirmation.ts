export function createBookingConfirmationEmail(data: {
  customerName: string;
  customerEmail: string;
  bookingId: string;
  serviceType: string;
  address: string;
  postcode: string;
  phone: string;
  contactPermission: string;
}) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmation</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header with subtle accent -->
        <tr>
          <td style="padding: 0;">
            <div style="height: 4px; background: linear-gradient(90deg, #2563eb 0%, #3b82f6 100%);"></div>
          </td>
        </tr>
        
        <tr>
          <td style="padding: 40px 24px 24px 24px;">
            <!-- Header -->
            <h1 style="margin: 0 0 8px 0; font-size: 26px; font-weight: 700; color: #1a1a1a; line-height: 1.3; letter-spacing: -0.5px;">
              Booking Confirmed
            </h1>
            <p style="margin: 0 0 32px 0; font-size: 15px; color: #525252; line-height: 1.6;">
              Thank you for choosing us. Your bin cleaning service has been scheduled successfully.
            </p>

            <!-- Booking Details -->
            <div style="margin-bottom: 32px;">
              <h2 style="margin: 0 0 12px 0; font-size: 13px; font-weight: 600; color: #2563eb; text-transform: uppercase; letter-spacing: 0.5px;">
                Booking Details
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
                    <p style="margin: 0; font-size: 14px; color: #1a1a1a; font-weight: 500;">${data.serviceType}</p>
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
                    <p style="margin: 0 0 3px 0; font-size: 11px; color: #737373; font-weight: 500; text-transform: uppercase; letter-spacing: 0.3px;">Phone</p>
                    <p style="margin: 0; font-size: 14px; color: #1a1a1a; font-weight: 500;">${data.phone}</p>
                  </td>
                </tr>
              </table>
            </div>

            <!-- What Happens Next -->
            <div style="margin-bottom: 32px;">
              <h2 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 600; color: #2563eb; text-transform: uppercase; letter-spacing: 0.5px;">
                What Happens Next
              </h2>
              <div style="padding: 20px; background-color: #f8fafc; border-left: 3px solid #2563eb;">
                <p style="margin: 0 0 12px 0; font-size: 15px; color: #1a1a1a; line-height: 1.6; font-weight: 500;">
                  Your service has been scheduled and will be completed as planned.
                </p>
                <p style="margin: 0; font-size: 15px; color: #525252; line-height: 1.6;">
                  We will only contact you if there are any issues with your booking. Otherwise, our team will arrive as scheduled.
                </p>
              </div>
            </div>

            <!-- Help Section -->
            <div style="padding: 20px; background-color: #fafafa; border: 1px solid #e5e5e5;">
              <h3 style="margin: 0 0 8px 0; font-size: 15px; font-weight: 600; color: #1a1a1a;">
                Need Help?
              </h3>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #525252; line-height: 1.6;">
                If you have any questions or need to make changes to your booking, we're here to help!
              </p>
              <a href="https://bin-cleaning-service.netlify.app/contact" style="display: inline-block; padding: 8px 16px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 4px; font-size: 13px; font-weight: 500;">
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
}
