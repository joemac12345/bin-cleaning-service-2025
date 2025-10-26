import nodemailer from 'nodemailer';

interface EmailConfig {
  to: string;
  subject: string;
  html: string;
}

interface BookingEmailData {
  customerName: string;
  customerEmail: string;
  bookingId: string;
  serviceType: string;
  collectionDay: string;
  address: string;
  binCount: number;
  totalPrice: number;
  createdAt: string;
}

interface StatusUpdateEmailData {
  customerName: string;
  customerEmail: string;
  bookingId: string;
  serviceType: string;
  newStatus: string;
  address: string;
  scheduledDate?: string;
  notes?: string;
}

interface AdminNotificationData {
  bookingId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  serviceType: string;
  collectionDay: string;
  totalPrice: number;
  createdAt: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null;
  private isConfigured: boolean;

  constructor() {
    const gmailEmail = process.env.GMAIL_EMAIL;
    const gmailPassword = process.env.GMAIL_APP_PASSWORD;
    
    console.log('Email Service Configuration:', {
      hasEmail: !!gmailEmail,
      hasPassword: !!gmailPassword,
      email: gmailEmail ? `${gmailEmail.substring(0, 3)}***` : 'undefined'
    });

    this.isConfigured = !!(gmailEmail && gmailPassword);
    
    if (this.isConfigured) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailEmail,
          pass: gmailPassword,
        },
      });
    } else {
      this.transporter = null;
      console.warn('Email service not configured - missing GMAIL_EMAIL or GMAIL_APP_PASSWORD');
    }
  }

  async sendEmail({ to, subject, html }: EmailConfig, type: string = 'unknown', metadata?: any) {
    console.log('Attempting to send email:', { to, subject, type, isConfigured: this.isConfigured });
    
    if (!this.isConfigured || !this.transporter) {
      console.warn('Email service not configured, skipping email send');
      return { success: false, error: 'Email service not configured' };
    }

    try {
      const mailOptions = {
        from: `${process.env.COMPANY_NAME} <${process.env.GMAIL_EMAIL}>`,
        to,
        subject,
        html,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Email sending failed:', error);
      
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }



  generateBookingConfirmationEmail(data: BookingEmailData): string {
    const {
      customerName,
      bookingId,
      serviceType,
      collectionDay,
      address,
      binCount,
      totalPrice,
      createdAt,
    } = data;

    const formattedDate = new Date(createdAt).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation</title>
        <style>
            /* Reset and base styles */
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; 
                line-height: 1.6; 
                color: #000000; 
                background-color: #f8f9fa;
                margin: 0; 
                padding: 20px;
            }
            .email-container { 
                max-width: 600px; 
                margin: 0 auto; 
                background: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            }
            
            /* Header - Professional */
            .header { 
                background: #000000;
                color: #ffffff; 
                padding: 40px 30px;
                text-align: left;
            }
            .logo-container {
                margin-bottom: 16px;
                display: inline-block;
            }
            .header h1 {
                font-size: 28px;
                font-weight: 700;
                margin-bottom: 8px;
                letter-spacing: -0.5px;
            }
            .header p {
                font-size: 16px;
                opacity: 0.85;
                margin: 0;
            }
            
            /* Content area */
            .content { 
                padding: 40px 30px;
                background: #ffffff;
            }
            .greeting {
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 16px;
                color: #000000;
            }
            .intro-text {
                font-size: 16px;
                color: #374151;
                margin-bottom: 32px;
                line-height: 1.6;
            }
            
            /* Booking card - Clean design */
            .booking-card { 
                background: #f8f9fa;
                border: 1px solid #e5e7eb;
                border-radius: 12px;
                padding: 30px;
                margin: 30px 0;
            }
            .booking-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 24px;
                flex-wrap: wrap;
                gap: 12px;
            }
            .booking-id { 
                background: #000000;
                color: #ffffff;
                padding: 8px 16px;
                border-radius: 6px;
                font-weight: 600;
                font-size: 14px;
                letter-spacing: 0.5px;
            }
            .status-badge { 
                background: #fef3c7;
                color: #92400e;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            /* Details section - Spreadsheet Style */
            .details-section {
                margin-bottom: 30px;
            }
            .details-section h3 {
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 0px;
                color: #000000;
                background: #f8f9fa;
                padding: 16px 20px;
                border: 1px solid #e5e7eb;
                border-bottom: 2px solid #000000;
                margin: -1px -1px 0 -1px;
            }
            .details-table {
                border: 1px solid #e5e7eb;
                border-radius: 0 0 8px 8px;
                overflow: hidden;
                background: #ffffff;
            }
            .detail-row { 
                display: grid;
                grid-template-columns: 1fr 1fr;
                border-bottom: 1px solid #e5e7eb;
                margin: 0;
                padding: 0;
            }
            .detail-row:last-child {
                border-bottom: none;
            }
            .detail-label { 
                font-weight: 600;
                color: #374151;
                font-size: 14px;
                line-height: 1.4;
                padding: 16px 20px;
                background: #f8f9fa;
                border-right: 1px solid #e5e7eb;
                margin: 0;
                display: flex;
                align-items: center;
            }
            .detail-value { 
                color: #000000;
                font-size: 14px;
                line-height: 1.4;
                font-weight: 500;
                padding: 16px 20px;
                background: #ffffff;
                margin: 0;
                display: flex;
                align-items: center;
                justify-content: flex-start;
            }            /* Total section - Prominent */
            .total-section { 
                background: #000000;
                color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                margin: 24px 0;
                text-align: center;
            }
            .total-amount { 
                font-size: 32px;
                font-weight: 700;
                letter-spacing: -1px;
            }
            .total-label {
                font-size: 14px;
                opacity: 0.8;
                margin-bottom: 4px;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            /* Next steps - Professional info box */
            .next-steps {
                background: #f0f9ff;
                border: 1px solid #e0f2fe;
                border-radius: 8px;
                padding: 24px;
                margin: 30px 0;
            }
            .next-steps h4 {
                color: #0369a1;
                margin-bottom: 12px;
                font-size: 16px;
                font-weight: 600;
            }
            .next-steps ul {
                margin: 0;
                padding-left: 20px;
                color: #0c4a6e;
            }
            .next-steps li {
                margin: 8px 0;
                line-height: 1.5;
            }
            
            /* Footer - Professional */
            .footer { 
                background: #f8f9fa;
                padding: 30px;
                text-align: center;
                border-top: 1px solid #e5e7eb;
            }
            .company-name {
                font-size: 20px;
                font-weight: 700;
                color: #000000;
                margin-bottom: 16px;
            }
            .contact-info {
                margin: 16px 0;
                color: #6b7280;
            }
            .contact-info p {
                margin: 4px 0;
                font-size: 14px;
            }
            .footer-note {
                font-size: 12px;
                color: #9ca3af;
                margin-top: 20px;
                line-height: 1.4;
            }
            
            /* Mobile responsive */
            @media (max-width: 600px) {
                body { padding: 10px; }
                .email-container { border-radius: 8px; }
                .header { padding: 30px 20px; }
                .content { padding: 30px 20px; }
                .booking-card { padding: 20px; }
                .detail-row { 
                    grid-template-columns: 1fr;
                }
                .detail-label { 
                    border-right: none;
                    border-bottom: 1px solid #e5e7eb;
                    font-weight: 700;
                    background: #000000;
                    color: #ffffff;
                }
                .detail-value { 
                    padding-top: 12px;
                    padding-bottom: 20px;
                }
                .booking-header {
                    flex-direction: column;
                    align-items: flex-start;
                }
                .total-amount { font-size: 28px; }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
                        <div class="header">
                <div class="logo-container">
                    <svg width="40" height="40" viewBox="0 0 40 40" style="margin-bottom: 12px;">
                        <rect x="8" y="12" width="24" height="20" rx="2" fill="none" stroke="#ffffff" stroke-width="2"/>
                        <path d="M8 16 L32 16" stroke="#ffffff" stroke-width="2"/>
                        <circle cx="12" cy="20" r="1.5" fill="#ffffff"/>
                        <circle cx="20" cy="20" r="1.5" fill="#ffffff"/>
                        <circle cx="28" cy="20" r="1.5" fill="#ffffff"/>
                        <path d="M12 8 L12 12 M20 8 L20 12 M28 8 L28 12" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
                <h1>Booking Confirmed</h1>
                <p>Your professional bin cleaning service</p>
            </div>
            
                        <div class="content">
                <div class="greeting">Hello ${data.customerName},</div>
                
                <p class="intro-text">
                    Excellent news! Your bin cleaning service has been successfully booked and confirmed. Our professional cleaning team has been notified and your service is now scheduled in our system.
                </p>
                
                <p class="intro-text">
                    We understand how important it is to maintain clean and hygienic bins, especially in today's health-conscious environment. Our experienced team uses professional-grade equipment and eco-friendly cleaning solutions to ensure your bins are thoroughly sanitized and deodorized.
                </p>
                
                <p class="intro-text">
                    This confirmation email contains all the important details about your upcoming service. Please keep this email for your records and don't hesitate to contact us if you have any questions or special requirements.
                </p>
                
                <div class="booking-card">
                    <div class="booking-header">
                        <div class="booking-id">${bookingId}</div>
                        <div class="status-badge">Confirmed</div>
                    </div>
                    
                    <div class="details-section">
                        <h3>Service Details</h3>
                        <div class="details-table">
                            <div class="detail-row">
                                <div class="detail-label">Service Type</div>
                                <div class="detail-value">${serviceType === 'regular' ? 'Regular Clean' : 'One-off Clean'}</div>
                            </div>
                            <div class="detail-row">
                                <div class="detail-label">Collection Day</div>
                                <div class="detail-value">${collectionDay || 'To be scheduled'}</div>
                            </div>
                            <div class="detail-row">
                                <div class="detail-label">Number of Bins</div>
                                <div class="detail-value">${binCount} ${binCount === 1 ? 'bin' : 'bins'}</div>
                            </div>
                            <div class="detail-row">
                                <div class="detail-label">Service Address</div>
                                <div class="detail-value">${address}</div>
                            </div>
                            <div class="detail-row">
                                <div class="detail-label">Booking Date</div>
                                <div class="detail-value">${formattedDate}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="total-section">
                        <div class="total-label">Total Amount</div>
                        <div class="total-amount">£${totalPrice.toFixed(2)}</div>
                    </div>
                </div>

                                <div class="service-info">
                    <h3>What's included in your comprehensive bin cleaning service:</h3>
                    <ul>
                        <li><strong>Professional exterior cleaning:</strong> Complete washing and sanitization of the bin exterior using high-pressure equipment</li>
                        <li><strong>Interior deep clean:</strong> Thorough interior scrubbing, sanitization, and deodorization to eliminate bacteria and unpleasant odors</li>
                        <li><strong>Eco-friendly cleaning products:</strong> We use environmentally safe, biodegradable cleaning solutions that are safe for your family and pets</li>
                        <li><strong>Handle and rim cleaning:</strong> Special attention to frequently touched areas including handles, rims, and lids</li>
                        <li><strong>Surrounding area tidying:</strong> We'll clean the immediate area around your bins and remove any spillage or debris</li>
                        <li><strong>Quality inspection:</strong> Final quality check to ensure your bins meet our high cleanliness standards</li>
                        <li><strong>Before and after photos:</strong> Available upon request to document the transformation of your bins</li>
                    </ul>
                </div>
                
                <div class="next-steps">
                    <h4>What happens next - Your service timeline</h4>
                    <ul>
                        <li><strong>Service preparation:</strong> Our team will review your booking details and prepare the necessary equipment and eco-friendly cleaning supplies</li>
                        <li><strong>Service day arrival:</strong> Our uniformed, professional team will arrive during your confirmed service window with all necessary equipment</li>
                        <li><strong>Bin preparation:</strong> We'll position your bins for optimal cleaning access while protecting your property</li>
                        <li><strong>Professional cleaning process:</strong> Complete interior and exterior cleaning typically takes 15-20 minutes per bin, depending on condition and size</li>
                        <li><strong>Quality assurance:</strong> Final inspection to ensure all bins meet our high cleanliness and hygiene standards</li>
                        <li><strong>Area restoration:</strong> We'll return your bins to their original position and tidy the surrounding area</li>
                        <li><strong>Payment processing:</strong> Secure payment will be processed after successful service completion</li>
                        <li><strong>Service confirmation:</strong> You'll receive a detailed completion email with any relevant photos or notes about the service</li>
                    </ul>
                </div>
            </div>
            
                        <div class="footer">
                <div class="footer-logo">
                    <svg width="32" height="32" viewBox="0 0 40 40" style="margin-bottom: 8px;">
                        <rect x="8" y="12" width="24" height="20" rx="2" fill="none" stroke="#6b7280" stroke-width="2"/>
                        <path d="M8 16 L32 16" stroke="#6b7280" stroke-width="2"/>
                        <circle cx="12" cy="20" r="1.5" fill="#6b7280"/>
                        <circle cx="20" cy="20" r="1.5" fill="#6b7280"/>
                        <circle cx="28" cy="20" r="1.5" fill="#6b7280"/>
                        <path d="M12 8 L12 12 M20 8 L20 12 M28 8 L28 12" stroke="#6b7280" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
                <div class="company-name">${process.env.COMPANY_NAME || 'Professional Bin Cleaning'}</div>
                <div class="contact-info">
                    <p><strong>Email:</strong> ${process.env.COMPANY_EMAIL || 'hello@bincleaningservice.com'}</p>
                    <p><strong>Phone:</strong> ${process.env.COMPANY_PHONE || '+44 20 1234 5678'}</p>
                    <p><strong>Website:</strong> ${process.env.COMPANY_WEBSITE || 'www.bincleaningservice.com'}</p>
                </div>
                <div class="footer-note">
                    Thank you for choosing our professional bin cleaning service. We're committed to providing exceptional service that keeps your bins spotless, hygienic, and odor-free. Our experienced team takes pride in delivering reliable, eco-friendly cleaning solutions that protect both your family's health and the environment. We appreciate your trust in our services and look forward to exceeding your expectations.
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  async sendBookingConfirmation(bookingData: BookingEmailData) {
    const subject = `Booking Confirmation - ${bookingData.bookingId}`;
    const html = this.generateBookingConfirmationEmail(bookingData);

    return this.sendEmail({
      to: bookingData.customerEmail,
      subject,
      html,
    }, 'booking-confirmation', {
      customerName: bookingData.customerName,
      bookingId: bookingData.bookingId,
      serviceType: bookingData.serviceType,
      totalPrice: bookingData.totalPrice
    });
  }

  // Status update email templates
  private generateStatusUpdateEmail(data: StatusUpdateEmailData): string {
    const statusConfig = {
      'new-job': {
        title: 'Job Confirmed',
        message: 'Excellent news! Your bin cleaning service has been successfully booked and confirmed. Our professional cleaning team has been notified of your booking details and is prepared to deliver exceptional service to your property.',
        headerColor: '#0284c7',
        statusColor: '#0284c7',
        statusBg: '#eff6ff',
        nextSteps: [
          'Our professional cleaning team has been assigned to your service and will arrive fully equipped during your confirmed time slot',
          'We\'ll contact you 30 minutes before arrival to ensure convenient timing and accessibility to your bins',
          'The cleaning process will be completed using our eco-friendly, professional-grade equipment and sanitization products',
          'Secure payment will be processed immediately after successful service completion using your preferred payment method',
          'You\'ll receive a detailed completion confirmation email with before/after photos (if requested) and service summary'
        ]
      },
      completed: {
        title: 'Service Completed',
        message: 'Excellent! Your bin cleaning service has been successfully completed to our high professional standards. Our team has thoroughly cleaned, sanitized, and deodorized all of your bins using eco-friendly products and professional-grade equipment. Your bins are now spotless, hygienic, and ready for use.',
        headerColor: '#059669',
        statusColor: '#059669',
        statusBg: '#ecfdf5',
        nextSteps: [
          'All bins have been comprehensively cleaned, sanitized, and deodorized using professional-grade equipment and eco-friendly cleaning solutions',
          'Final quality inspection has been completed to ensure all bins meet our exceptional cleanliness and hygiene standards',
          'Secure payment has been successfully processed using your preferred payment method - you should see the transaction reflected shortly',
          'Your bins have been returned to their original positions with the surrounding area tidied and any spillage cleaned',
          'Thank you for choosing our professional bin cleaning service - we truly appreciate your trust in our expertise and commitment to quality',
          'We look forward to serving you again and maintaining the cleanliness and hygiene of your bins with our reliable, professional service'
        ]
      }
    };

    const config = statusConfig[data.newStatus as keyof typeof statusConfig] || statusConfig['new-job'];

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Update - ${data.bookingId}</title>
        <style>
            /* Reset and base styles */
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; 
                line-height: 1.6; 
                color: #000000; 
                background-color: #f8f9fa;
                margin: 0; 
                padding: 20px;
            }
            .email-container { 
                max-width: 600px; 
                margin: 0 auto; 
                background: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            }
            
            /* Header - Professional */
            .header { 
                background: ${config.headerColor};
                color: #ffffff; 
                padding: 40px 30px;
                text-align: left;
            }
            .header h1 {
                font-size: 28px;
                font-weight: 700;
                margin-bottom: 8px;
                letter-spacing: -0.5px;
            }
            .header p {
                font-size: 16px;
                opacity: 0.85;
                margin: 0;
            }
            
            /* Content area */
            .content { 
                padding: 40px 30px;
                background: #ffffff;
            }
            .greeting {
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 16px;
                color: #000000;
            }
            
            /* Status update section */
            .status-update {
                background: ${config.statusBg};
                border: 1px solid ${config.statusColor}20;
                border-left: 4px solid ${config.statusColor};
                border-radius: 8px;
                padding: 24px;
                margin: 30px 0;
            }
            .status-title {
                color: ${config.statusColor};
                font-size: 20px;
                font-weight: 700;
                margin-bottom: 8px;
            }
            .status-message {
                color: #374151;
                font-size: 16px;
                line-height: 1.6;
                margin: 0;
            }
            
            /* Booking details - Spreadsheet Style */
            .booking-details { 
                background: #ffffff;
                border: 1px solid #e5e7eb;
                border-radius: 12px;
                overflow: hidden;
                margin: 30px 0;
            }
            .details-title {
                font-size: 18px;
                font-weight: 600;
                margin: 0;
                color: #000000;
                background: #f8f9fa;
                padding: 16px 20px;
                border-bottom: 2px solid #000000;
            }
            .details-table {
                background: #ffffff;
            }
            .detail-row { 
                display: grid;
                grid-template-columns: 1fr 1fr;
                border-bottom: 1px solid #e5e7eb;
                margin: 0;
                padding: 0;
            }
            .detail-row:last-child {
                border-bottom: none;
            }
            .detail-label { 
                font-weight: 600;
                color: #374151;
                font-size: 14px;
                line-height: 1.4;
                padding: 16px 20px;
                background: #f8f9fa;
                border-right: 1px solid #e5e7eb;
                margin: 0;
                display: flex;
                align-items: center;
            }
            .detail-value { 
                color: #000000;
                font-size: 14px;
                line-height: 1.4;
                font-weight: 500;
                padding: 16px 20px;
                background: #ffffff;
                margin: 0;
                display: flex;
                align-items: center;
                justify-content: flex-start;
            }
            .booking-id-value {
                font-family: 'Monaco', 'Menlo', monospace;
                font-size: 14px;
                background: #000000;
                color: #ffffff;
                padding: 4px 8px;
                border-radius: 4px;
            }
            
            /* Next steps */
            .next-steps {
                background: #f0f9ff;
                border: 1px solid #e0f2fe;
                border-radius: 8px;
                padding: 24px;
                margin: 30px 0;
            }
            .next-steps h4 {
                color: #0369a1;
                margin-bottom: 12px;
                font-size: 16px;
                font-weight: 600;
            }
            .next-steps ul {
                margin: 0;
                padding-left: 20px;
                color: #0c4a6e;
            }
            .next-steps li {
                margin: 8px 0;
                line-height: 1.5;
            }
            
            /* Notes section */
            .notes-section {
                background: #fffbeb;
                border: 1px solid #fde047;
                border-left: 4px solid #f59e0b;
                border-radius: 8px;
                padding: 20px;
                margin: 24px 0;
            }
            .notes-title {
                color: #92400e;
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 8px;
            }
            .notes-content {
                color: #78350f;
                margin: 0;
                line-height: 1.6;
            }
            
            /* Footer */
            .footer { 
                background: #f8f9fa;
                padding: 30px;
                text-align: left;
                border-top: 1px solid #e5e7eb;
            }
            .footer-logo {
                margin-bottom: 12px;
                display: inline-block;
            }
            .company-name {
                font-size: 20px;
                font-weight: 700;
                color: #000000;
                margin-bottom: 16px;
            }
            .contact-info {
                margin: 16px 0;
                color: #6b7280;
            }
            .contact-info p {
                margin: 4px 0;
                font-size: 14px;
            }
            .footer-note {
                font-size: 12px;
                color: #9ca3af;
                margin-top: 20px;
                line-height: 1.4;
            }
            
            /* Mobile responsive */
            @media (max-width: 600px) {
                body { padding: 10px; }
                .email-container { border-radius: 8px; }
                .header { padding: 30px 20px; }
                .content { padding: 30px 20px; }
                .detail-row { 
                    grid-template-columns: 1fr;
                }
                .detail-label { 
                    border-right: none;
                    border-bottom: 1px solid #e5e7eb;
                    font-weight: 700;
                    background: #000000;
                    color: #ffffff;
                }
                .detail-value { 
                    padding-top: 12px;
                    padding-bottom: 20px;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <div class="logo-container">
                    <svg width="40" height="40" viewBox="0 0 40 40" style="margin-bottom: 12px;">
                        <rect x="8" y="12" width="24" height="20" rx="2" fill="none" stroke="#ffffff" stroke-width="2"/>
                        <path d="M8 16 L32 16" stroke="#ffffff" stroke-width="2"/>
                        <circle cx="12" cy="20" r="1.5" fill="#ffffff"/>
                        <circle cx="20" cy="20" r="1.5" fill="#ffffff"/>
                        <circle cx="28" cy="20" r="1.5" fill="#ffffff"/>
                        <path d="M12 8 L12 12 M20 8 L20 12 M28 8 L28 12" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
                <h1>Status Update</h1>
                <p>Professional bin cleaning service update</p>
            </div>
            
            <div class="content">
                <div class="greeting">Hello ${data.customerName},</div>
                
                <div class="status-update">
                    <div class="status-title">${config.title}</div>
                    <div class="status-message">${config.message}</div>
                </div>
                
                <div class="booking-details">
                    <div class="details-title">Booking Information</div>
                    <div class="details-table">
                        <div class="detail-row">
                            <div class="detail-label">Booking ID</div>
                            <div class="detail-value">
                                <span class="booking-id-value">${data.bookingId}</span>
                            </div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Service Type</div>
                            <div class="detail-value">${data.serviceType}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Service Address</div>
                            <div class="detail-value">${data.address}</div>
                        </div>
                        ${data.scheduledDate ? `
                        <div class="detail-row">
                            <div class="detail-label">Scheduled Date</div>
                            <div class="detail-value">${data.scheduledDate}</div>
                        </div>
                        ` : ''}
                    </div>
                </div>

                <div class="next-steps">
                    <h4>What's happening next</h4>
                    <ul>
                        ${config.nextSteps.map(step => `<li>${step}</li>`).join('')}
                    </ul>
                </div>
                
                ${data.notes ? `
                <div class="notes-section">
                    <div class="notes-title">Service Notes</div>
                    <div class="notes-content">${data.notes}</div>
                </div>
                ` : ''}
            </div>
            
            <div class="footer">
                <div class="footer-logo">
                    <svg width="32" height="32" viewBox="0 0 40 40" style="margin-bottom: 8px;">
                        <rect x="8" y="12" width="24" height="20" rx="2" fill="none" stroke="#6b7280" stroke-width="2"/>
                        <path d="M8 16 L32 16" stroke="#6b7280" stroke-width="2"/>
                        <circle cx="12" cy="20" r="1.5" fill="#6b7280"/>
                        <circle cx="20" cy="20" r="1.5" fill="#6b7280"/>
                        <circle cx="28" cy="20" r="1.5" fill="#6b7280"/>
                        <path d="M12 8 L12 12 M20 8 L20 12 M28 8 L28 12" stroke="#6b7280" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
                <div class="company-name">${process.env.COMPANY_NAME || 'Professional Bin Cleaning'}</div>
                <div class="contact-info">
                    <p><strong>Email:</strong> ${process.env.COMPANY_EMAIL || 'hello@bincleaningservice.com'}</p>
                    <p><strong>Phone:</strong> ${process.env.COMPANY_PHONE || '+44 20 1234 5678'}</p>
                    <p><strong>Website:</strong> ${process.env.COMPANY_WEBSITE || 'www.bincleaningservice.com'}</p>
                </div>
                <div class="footer-note">
                    This is an automated status update for your bin cleaning service. We believe in keeping our customers fully informed throughout the entire service process. If you have any questions about your booking, special requirements, or would like to discuss additional services, please don't hesitate to contact us using the details above. Our customer service team is always ready to assist you and ensure your complete satisfaction with our professional bin cleaning services.
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  private generateAdminNotificationEmail(data: AdminNotificationData): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Alert - New Booking ${data.bookingId}</title>
        <style>
            /* Reset and base styles */
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; 
                line-height: 1.6; 
                color: #000000; 
                background-color: #f8f9fa;
                margin: 0; 
                padding: 20px;
            }
            .email-container { 
                max-width: 650px; 
                margin: 0 auto; 
                background: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            }
            
            /* Header - Professional Admin Alert */
            .header { 
                background: #000000;
                color: #ffffff; 
                padding: 30px;
                text-align: left;
            }
            .header h1 {
                font-size: 24px;
                font-weight: 700;
                margin-bottom: 8px;
                letter-spacing: -0.5px;
            }
            .header .alert-badge {
                background: #dc2626;
                color: #ffffff;
                padding: 4px 12px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                display: inline-block;
                margin-top: 4px;
            }
            
            /* Content area */
            .content { 
                padding: 30px;
                background: #ffffff;
            }
            
            /* Alert banner */
            .alert-banner {
                background: #fef3c7;
                border: 1px solid #f59e0b;
                border-left: 4px solid #f59e0b;
                border-radius: 8px;
                padding: 20px;
                margin: 30px 0;
            }
            .alert-title {
                color: #92400e;
                font-size: 18px;
                font-weight: 700;
                margin-bottom: 8px;
            }
            .alert-message {
                color: #78350f;
                font-size: 15px;
                margin: 0;
                line-height: 1.6;
            }
            
            /* Booking value highlight */
            .value-highlight {
                background: #000000;
                color: #ffffff;
                text-align: center;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 30px;
            }
            .value-amount {
                font-size: 32px;
                font-weight: 700;
                margin-bottom: 4px;
            }
            .value-label {
                font-size: 14px;
                opacity: 0.8;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            /* Sections */
            .section { 
                background: #f8f9fa;
                border: 1px solid #e5e7eb;
                border-radius: 12px;
                padding: 25px;
                margin: 25px 0;
            }
            .section-title {
                font-size: 16px;
                font-weight: 700;
                margin-bottom: 18px;
                color: #000000;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                border-bottom: 2px solid #000000;
                padding-bottom: 8px;
            }
            
            /* Info grid */
            .info-grid { 
                display: grid;
                gap: 12px;
            }
            .info-row { 
                display: flex; 
                justify-content: space-between; 
                align-items: flex-start;
                padding: 16px 0;
                border-bottom: 1px solid #e5e7eb;
                margin-bottom: 8px;
            }
            .info-row:last-child {
                border-bottom: none;
                margin-bottom: 0;
            }
            .info-label { 
                font-weight: 600;
                color: #374151;
                flex: 0 0 140px;
                font-size: 14px;
            }
            .info-value { 
                color: #6b7280;
                text-align: right;
                flex: 1;
                font-size: 14px;
            }
            .info-value strong {
                color: #000000;
            }
            .booking-id-value {
                font-family: 'Monaco', 'Menlo', monospace;
                font-size: 13px;
                background: #000000;
                color: #ffffff;
                padding: 4px 8px;
                border-radius: 4px;
                font-weight: 500;
            }
            .contact-link {
                color: #0066cc;
                text-decoration: none;
                font-weight: 500;
            }
            .contact-link:hover {
                text-decoration: underline;
            }
            
            /* Action required */
            .action-section {
                background: #fef2f2;
                border: 1px solid #fecaca;
                border-left: 4px solid #dc2626;
                border-radius: 8px;
                padding: 24px;
                margin: 30px 0;
            }
            .action-title {
                color: #dc2626;
                font-size: 16px;
                font-weight: 700;
                margin-bottom: 12px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .action-list {
                margin: 0;
                padding-left: 20px;
                color: #991b1b;
            }
            .action-list li {
                margin: 8px 0;
                line-height: 1.5;
                font-weight: 500;
            }
            
            /* CTA Button */
            .cta-section {
                text-align: center;
                margin: 30px 0;
            }
            .cta-button {
                background: #000000;
                color: #ffffff;
                padding: 16px 32px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 16px;
                display: inline-block;
                transition: background-color 0.2s;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .cta-button:hover {
                background: #374151;
            }
            
            /* Footer */
            .footer { 
                background: #f8f9fa;
                padding: 25px;
                text-align: left;
                border-top: 1px solid #e5e7eb;
            }
            .company-name {
                font-size: 18px;
                font-weight: 700;
                color: #000000;
                margin-bottom: 8px;
            }
            .system-info {
                color: #6b7280;
                font-size: 13px;
                margin: 0;
                line-height: 1.4;
            }
            .timestamp {
                color: #9ca3af;
                font-size: 12px;
                margin-top: 8px;
                font-family: 'Monaco', 'Menlo', monospace;
            }
            
            /* Mobile responsive */
            @media (max-width: 600px) {
                body { padding: 10px; }
                .email-container { border-radius: 8px; }
                .header { padding: 25px 20px; }
                .content { padding: 25px 20px; }
                .section { padding: 20px; }
                .info-row { 
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 4px;
                }
                .info-label { flex: none; }
                .info-value { text-align: left; }
                .value-amount { font-size: 28px; }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <div class="logo-container">
                    <svg width="40" height="40" viewBox="0 0 40 40" style="margin-bottom: 12px;">
                        <rect x="8" y="12" width="24" height="20" rx="2" fill="none" stroke="#ffffff" stroke-width="2"/>
                        <path d="M8 16 L32 16" stroke="#ffffff" stroke-width="2"/>
                        <circle cx="12" cy="20" r="1.5" fill="#ffffff"/>
                        <circle cx="20" cy="20" r="1.5" fill="#ffffff"/>
                        <circle cx="28" cy="20" r="1.5" fill="#ffffff"/>
                        <path d="M12 8 L12 12 M20 8 L20 12 M28 8 L28 12" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
                <h1>NEW BOOKING RECEIVED</h1>
                <div class="alert-badge">Urgent Action Required</div>
            </div>
            
            <div class="content">
                <div class="value-highlight">
                    <div class="value-amount">£${data.totalPrice}</div>
                    <div class="value-label">New Booking Value</div>
                </div>
                
                <div class="alert-banner">
                    <div class="alert-title">Immediate Processing Required</div>
                    <div class="alert-message">A new customer booking has been submitted through the online booking system and requires immediate processing within 2 hours to maintain our high service standards and customer satisfaction commitments. Please review all booking details carefully, confirm service availability for the requested date and location, and contact the customer to finalize the appointment scheduling.</div>
                </div>
                
                <div class="section">
                    <div class="section-title">Customer Information</div>
                    <div class="info-grid">
                        <div class="info-row">
                            <div class="info-label">Customer Name</div>
                            <div class="info-value"><strong>${data.customerName}</strong></div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Email Address</div>
                            <div class="info-value">
                                <a href="mailto:${data.customerEmail}" class="contact-link">${data.customerEmail}</a>
                            </div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Phone Number</div>
                            <div class="info-value">
                                <a href="tel:${data.customerPhone}" class="contact-link">${data.customerPhone}</a>
                            </div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Service Address</div>
                            <div class="info-value">${data.address}</div>
                        </div>
                    </div>
                </div>
                
                <div class="section">
                    <div class="section-title">Service Details</div>
                    <div class="info-grid">
                        <div class="info-row">
                            <div class="info-label">Booking ID</div>
                            <div class="info-value">
                                <span class="booking-id-value">${data.bookingId}</span>
                            </div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Service Type</div>
                            <div class="info-value"><strong>${data.serviceType}</strong></div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Collection Day</div>
                            <div class="info-value">${data.collectionDay}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Booking Time</div>
                            <div class="info-value">${new Date(data.createdAt).toLocaleString('en-GB', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Total Value</div>
                            <div class="info-value"><strong>£${data.totalPrice}</strong></div>
                        </div>
                    </div>
                </div>
                
                <div class="action-section">
                    <div class="action-title">Required Actions</div>
                    <ul class="action-list">
                        <li><strong>Review booking details:</strong> Carefully examine all customer requirements, service preferences, and any special instructions or accessibility notes</li>
                        <li><strong>Verify service availability:</strong> Check team availability and capacity for the requested service date and confirm location accessibility</li>
                        <li><strong>Customer contact:</strong> Reach out to the customer within 1 hour to confirm appointment details and discuss any specific requirements</li>
                        <li><strong>Schedule confirmation:</strong> Update the booking status to "Confirmed" in the system and assign the appropriate team member</li>
                        <li><strong>Send confirmation communication:</strong> Dispatch professional booking confirmation email with all service details and contact information</li>
                        <li><strong>Team coordination:</strong> Add service appointment to team schedule with location details, equipment requirements, and customer preferences</li>
                        <li><strong>Equipment preparation:</strong> Ensure all necessary professional cleaning equipment, eco-friendly supplies, and payment processing tools are prepared</li>
                        <li><strong>Route optimization:</strong> Plan efficient service route and timing to maximize productivity and minimize customer wait times</li>
                    </ul>
                </div>
                
                <div class="cta-section">
                    <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/bookings" class="cta-button">
                        View in Admin Panel
                    </a>
                </div>
            </div>
            
            <div class="footer">
                <div class="footer-logo">
                    <svg width="32" height="32" viewBox="0 0 40 40" style="margin-bottom: 8px;">
                        <rect x="8" y="12" width="24" height="20" rx="2" fill="none" stroke="#6b7280" stroke-width="2"/>
                        <path d="M8 16 L32 16" stroke="#6b7280" stroke-width="2"/>
                        <circle cx="12" cy="20" r="1.5" fill="#6b7280"/>
                        <circle cx="20" cy="20" r="1.5" fill="#6b7280"/>
                        <circle cx="28" cy="20" r="1.5" fill="#6b7280"/>
                        <path d="M12 8 L12 12 M20 8 L20 12 M28 8 L28 12" stroke="#6b7280" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
                <div class="company-name">${process.env.COMPANY_NAME || 'Professional Bin Cleaning'}</div>
                <div class="contact-info" style="margin: 16px 0; color: #6b7280;">
                    <p><strong>Email:</strong> ${process.env.COMPANY_EMAIL || 'hello@bincleaningservice.com'}</p>
                    <p><strong>Phone:</strong> ${process.env.COMPANY_PHONE || '+44 20 1234 5678'}</p>
                    <p><strong>Website:</strong> ${process.env.COMPANY_WEBSITE || 'www.bincleaningservice.com'}</p>
                </div>
                <p class="system-info">
                    Automated Admin Notification System • Please process this booking within 2 hours to maintain our excellent service standards and ensure customer satisfaction. This notification contains all essential booking details for immediate action and follow-up.
                </p>
                <p class="timestamp">
                    Generated: ${new Date().toLocaleString('en-GB', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  async sendStatusUpdate(data: StatusUpdateEmailData) {
    const subject = `Booking Update: ${data.newStatus.charAt(0).toUpperCase() + data.newStatus.slice(1)} - ${data.bookingId}`;
    const html = this.generateStatusUpdateEmail(data);

    return this.sendEmail({
      to: data.customerEmail,
      subject,
      html,
    }, 'status-update', {
      customerName: data.customerName,
      bookingId: data.bookingId,
      oldStatus: data.newStatus, // You might want to track previous status
      newStatus: data.newStatus,
      serviceType: data.serviceType
    });
  }

  async sendAdminNotification(data: AdminNotificationData) {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.COMPANY_EMAIL || process.env.GMAIL_EMAIL;
    if (!adminEmail) {
      console.warn('No admin email configured for notifications');
      return { success: false, error: 'No admin email configured' };
    }

    const subject = `🚨 New Booking: ${data.bookingId} - £${data.totalPrice}`;
    const html = this.generateAdminNotificationEmail(data);

    return this.sendEmail({
      to: adminEmail,
      subject,
      html,
    }, 'admin-notification', {
      bookingId: data.bookingId,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      serviceType: data.serviceType,
      totalPrice: data.totalPrice
    });
  }
}

export const emailService = new EmailService();
