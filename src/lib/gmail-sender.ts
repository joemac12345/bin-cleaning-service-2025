import nodemailer from 'nodemailer';

// Email result types
export type EmailResult = 
  | { success: true; messageId: string; simulation: boolean }
  | { success: false; error: string; simulation: boolean };

// Gmail SMTP configuration
const createGmailTransporter = () => {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPassword = process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_APP_PASS;

  if (!gmailUser || !gmailPassword) {
    console.log('Gmail credentials not configured, falling back to simulation');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailUser,
      pass: gmailPassword, // This should be an App Password, not your regular Gmail password
    },
  });
};

export const sendEmailViaGmail = async (to: string, subject: string, html: string, replyTo?: string): Promise<EmailResult> => {
  const transporter = createGmailTransporter();
  
  if (!transporter) {
    // Simulation mode
    console.log('📧 GMAIL SIMULATION MODE');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('HTML content length:', html.length);
    return { 
      success: true, 
      messageId: `sim-${Date.now()}`,
      simulation: true 
    };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Bin Cleaning Service" <${process.env.GMAIL_USER}>`,
      to: to,
      subject: subject,
      html: html,
      replyTo: replyTo || process.env.GMAIL_USER,
    });

    console.log('✅ Gmail email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId, simulation: false };
  } catch (error) {
    console.error('❌ Gmail send error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error),
      simulation: false 
    };
  }
};
