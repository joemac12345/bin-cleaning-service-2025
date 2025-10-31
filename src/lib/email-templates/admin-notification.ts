export const createAdminNotificationEmail = (data: any) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Booking - Admin Notification</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header with accent -->
    <tr>
      <td style="padding: 0;">
        <div style="height: 4px; background: linear-gradient(90deg, #dc2626 0%, #ef4444 100%);"></div>
      </td>
    </tr>
    
    <tr>
      <td style="padding: 40px 24px 24px 24px;">
        <!-- Header -->
        <h1 style="margin: 0 0 8px 0; font-size: 26px; font-weight: 700; color: #1a1a1a; line-height: 1.3; letter-spacing: -0.5px;">
          New Booking Received
        </h1>
        <p style="margin: 0 0 32px 0; font-size: 15px; color: #525252; line-height: 1.6;">
          A new booking has been submitted and requires your attention.
        </p>

        <!-- Booking Details -->
        <div style="margin-bottom: 32px;">
          <h2 style="margin: 0 0 12px 0; font-size: 13px; font-weight: 600; color: #dc2626; text-transform: uppercase; letter-spacing: 0.5px;">
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
                <p style="margin: 0 0 3px 0; font-size: 11px; color: #737373; font-weight: 500; text-transform: uppercase; letter-spacing: 0.3px;">Customer Name</p>
                <p style="margin: 0; font-size: 14px; color: #1a1a1a; font-weight: 500;">${data.customerName}</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; border-bottom: 1px solid #e5e5e5;">
                <p style="margin: 0 0 3px 0; font-size: 11px; color: #737373; font-weight: 500; text-transform: uppercase; letter-spacing: 0.3px;">Email</p>
                <p style="margin: 0; font-size: 14px; color: #1a1a1a; font-weight: 500;">${data.customerEmail}</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; border-bottom: 1px solid #e5e5e5;">
                <p style="margin: 0 0 3px 0; font-size: 11px; color: #737373; font-weight: 500; text-transform: uppercase; letter-spacing: 0.3px;">Phone</p>
                <p style="margin: 0; font-size: 14px; color: #1a1a1a; font-weight: 500;">${data.phone}</p>
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
              <td style="padding: 10px 12px; border-bottom: 1px solid #e5e5e5;">
                <p style="margin: 0 0 3px 0; font-size: 11px; color: #737373; font-weight: 500; text-transform: uppercase; letter-spacing: 0.3px;">Contact Permission</p>
                <p style="margin: 0; font-size: 14px; color: #1a1a1a; font-weight: 500;">${data.contactPermission === 'yes' ? 'Yes, may contact' : 'Do not contact'}</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 12px 12px 12px;">
                <p style="margin: 0 0 3px 0; font-size: 11px; color: #737373; font-weight: 500; text-transform: uppercase; letter-spacing: 0.3px;">Submitted</p>
                <p style="margin: 0; font-size: 14px; color: #1a1a1a; font-weight: 500;">${new Date().toLocaleString()}</p>
              </td>
            </tr>
          </table>
        </div>

        <!-- Action Required -->
        <div style="margin-bottom: 32px;">
          <h2 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 600; color: #dc2626; text-transform: uppercase; letter-spacing: 0.5px;">
            Action Required
          </h2>
          <div style="padding: 20px; background-color: #fef2f2; border-left: 3px solid #dc2626;">
            <p style="margin: 0 0 12px 0; font-size: 15px; color: #1a1a1a; line-height: 1.6; font-weight: 500;">
              Review the booking details and schedule the service.
            </p>
            <p style="margin: 0; font-size: 15px; color: #525252; line-height: 1.6;">
              Update the booking status in the admin panel once confirmed.
            </p>
          </div>
        </div>

        <!-- Admin Link Section -->
        <div style="padding: 20px; background-color: #fafafa; border: 1px solid #e5e5e5;">
          <h3 style="margin: 0 0 12px 0; font-size: 15px; font-weight: 600; color: #1a1a1a;">
            Quick Actions
          </h3>
          <a href="https://bin-cleaning-service.netlify.app/admin/bookings" style="display: inline-block; padding: 8px 16px; background-color: #dc2626; color: #ffffff; text-decoration: none; border-radius: 4px; font-size: 13px; font-weight: 500;">
            View in Admin Panel
          </a>
        </div>

        <!-- Footer -->
        <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #e5e5e5;">
          <p style="margin: 0; font-size: 13px; color: #737373;">
            This is an automated notification sent to admins only.
          </p>
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
