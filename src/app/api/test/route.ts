import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('Test API endpoint called');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Test API is working',
      timestamp: new Date().toISOString(),
      env: {
        hasGmailEmail: !!process.env.GMAIL_EMAIL,
        hasGmailPassword: !!process.env.GMAIL_APP_PASSWORD,
        hasCompanyName: !!process.env.COMPANY_NAME,
      }
    });
  } catch (error) {
    console.error('Test API Error:', error);
    return NextResponse.json({ 
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
