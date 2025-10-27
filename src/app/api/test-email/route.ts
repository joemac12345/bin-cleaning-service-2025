import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Test email endpoint to diagnose delivery issues
export async function POST(request: NextRequest) {
  try {
    console.log('🔬 Testing email delivery...');
    
    const { testEmail } = await request.json();
    
    if (!testEmail) {
      return NextResponse.json({ error: 'Test email address required' }, { status: 400 });
    }

    const resendClient = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
    
    if (!resendClient) {
      return NextResponse.json({ 
        error: 'RESEND_API_KEY not configured',
        debug: {
          hasApiKey: !!process.env.RESEND_API_KEY,
          fromEmail: process.env.RESEND_FROM_EMAIL,
          adminEmail: process.env.ADMIN_EMAIL
        }
      }, { status: 500 });
    }

    console.log('📧 Testing customer email delivery...');
    console.log('From:', process.env.RESEND_FROM_EMAIL);
    console.log('To:', testEmail);

    // Test customer confirmation email
    const customerTest = await resendClient.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: testEmail,
      subject: 'Test Email - Deployment Configuration',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #10b981; margin-bottom: 20px;">✅ Email System Test Successful!</h2>
            <p style="color: #374151; line-height: 1.6; margin-bottom: 15px;">
              Your email configuration is working correctly. This test email confirms that:
            </p>
            <ul style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
              <li>Resend API key is valid</li>
              <li>From email address is authorized</li>
              <li>Email delivery is functional</li>
            </ul>
            <div style="background-color: #ecfdf5; padding: 15px; border-radius: 6px; border-left: 4px solid #10b981;">
              <p style="color: #065f46; margin: 0; font-weight: 500;">
                Your bin cleaning service is ready for deployment!
              </p>
            </div>
            <p style="color: #6b7280; font-size: 14px; margin-top: 20px; margin-bottom: 0;">
              Test performed at: ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      `
    });

    if (testResult.error) {
      return NextResponse.json({
        success: false,
        error: testResult.error.message || 'Email test failed'
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      emailId: testResult.data?.id
    });

  } catch (error: any) {
    console.error('Email test error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to test email configuration'
    }, { status: 500 });
  }
}
