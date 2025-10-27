import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { url, anonKey } = await request.json();
    
    if (!url || !anonKey) {
      return NextResponse.json(
        { success: false, error: 'URL and anon key are required' },
        { status: 400 }
      );
    }

    // Test connection by creating a temporary client and making a simple request
    const testClient = createClient(url, anonKey);
    
    // Try a simple request that doesn't require authentication
    // This will test if the URL and key are valid
    try {
      // Try to access the REST API endpoint - this validates the connection
      const response = await fetch(`${url}/rest/v1/`, {
        headers: {
          'apikey': anonKey,
          'Authorization': `Bearer ${anonKey}`
        }
      });
      
      // If we get a response (even if it's an error about missing table), the connection works
      if (!response.ok && response.status !== 404 && response.status !== 401) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
    } catch (fetchError: any) {
      // Network errors indicate connection problems
      if (fetchError.name === 'TypeError' && fetchError.message.includes('fetch')) {
        throw new Error('Cannot connect to Supabase URL. Please check the URL is correct.');
      }
      throw fetchError;
    }

    return NextResponse.json({
      success: true,
      message: 'Connection successful'
    });

  } catch (error: any) {
    console.error('Supabase connection test failed:', error);
    
    let errorMessage = 'Connection failed';
    if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 400 }
    );
  }
}
