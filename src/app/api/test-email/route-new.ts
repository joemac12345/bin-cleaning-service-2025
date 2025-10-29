import { NextRequest, NextResponse } from 'next/server';
import { sendEmailViaGmail } from '@/lib/gmail-sender';

// Test email endpoint to diagnose Gmail SMTP delivery
export async function POST(request: NextRequest) {
  try {
    console.log('🔬 Testing Gmail SMTP delivery...');
    
    const { testEmail } = await request.json();
    
    if (!testEmail) {
      return NextResponse.json({ error: 'Test email address required' }, { status: 400 });
    }

    // Check Gmail configuration
    const gmailUser = process.env.GMAIL_USER;
    const gmailPassword = process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_APP_PASS;
    
    if (!gmailUser || !gmailPassword) {
      return NextResponse.json({ 
        error: 'Gmail SMTP not configured',
        debug: {
          hasGmailUser: !!gmailUser,
          hasGmailPassword: !!gmailPassword,
          gmailUser: gmailUser ? gmailUser.substring(0, 5) + '***' : 'not set'
        }
      }, { status: 500 });
    }

    console.log('📧 Testing Gmail SMTP with configuration:', {
      gmailUser: gmailUser.substring(0, 5) + '***',
      hasPassword: !!gmailPassword,
      testEmail
    });

    // Send test email via Gmail
    const testEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #059669;">🧪 Gmail SMTP Test Email</h2>
        <p>This is a test email to verify Gmail SMTP configuration.</p>
        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <strong>Test Details:</strong><br>
          Sent from: ${gmailUser}<br>
          Sent to: ${testEmail}<br>
          Timestamp: ${new Date().toISOString()}<br>
          Service: Gmail SMTP
        </div>
        <p>If you received this email, your Gmail SMTP configuration is working correctly! ✅</p>
      </div>
    `;

    const result = await sendEmailViaGmail(
      testEmail,
      '🧪 Gmail SMTP Test - Bin Cleaning Service',
      testEmailContent,
      gmailUser
    );

    console.log('✅ Gmail test result:', result);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Gmail SMTP test email sent successfully!',
        service: 'gmail',
        testEmail,
        sentFrom: gmailUser,
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json({
        error: 'Gmail SMTP test failed',
        details: result.error,
        service: 'gmail'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Gmail test error:', error);
    return NextResponse.json({
      error: 'Gmail SMTP test failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      service: 'gmail'
    }, { status: 500 });
  }
}
