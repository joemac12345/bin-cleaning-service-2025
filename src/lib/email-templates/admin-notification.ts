export const createAdminNotificationEmail = (data: any) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Booking - Admin Notification</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; background-color: #f8fafc; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;">
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #dc2626; font-size: 24px; margin: 0; font-weight: 600;">🔔 New Booking Alert</h1>
      <p style="color: #7c2d12; font-size: 16px; margin: 10px 0 0 0;">Admin Notification</p>
    </div>
    
    <!-- Booking Details Card -->
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
    
    <!-- Action Required Card -->
    <div style="background-color: #fffbeb; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 25px 0;">
      <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px;">⚡ Action Required</h3>
      <ul style="margin: 0; padding-left: 20px; color: #78350f;">
        <li style="margin-bottom: 8px;">Review booking details for accuracy</li>
        <li style="margin-bottom: 8px;">Check service availability for the area</li>
        <li style="margin-bottom: 8px;">Contact customer within 24 hours</li>
        <li style="margin-bottom: 8px;">Update booking status in admin panel</li>
      </ul>
    </div>
    
    <!-- Admin Links (Optional) -->
    <div style="text-align: center; margin: 25px 0;">
      <a href="#" style="background-color: #1d4ed8; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block;">
        View in Admin Panel
      </a>
    </div>
    
  </div>
</body>
</html>
`;
