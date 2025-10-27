import nodemailer from 'nodemailer';

// Gmail SMTP configuration
const createGmailTransporter = () => {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPassword = process.env.GMAIL_APP_PASSWORD;

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

export const sendEmailViaGmail = async (to: string, subject: string, html: string, replyTo?: string) => {
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
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Gmail send error:', error);
    throw error;
  }
};
