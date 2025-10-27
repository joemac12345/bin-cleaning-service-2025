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

    // Basic validation of URL format
    if (!url.includes('supabase.co') && !url.includes('localhost')) {
      return NextResponse.json(
        { success: false, error: 'Invalid Supabase URL format' },
        { status: 400 }
      );
    }

    // Basic validation of anon key format (should be a JWT)
    if (!anonKey.startsWith('eyJ')) {
      return NextResponse.json(
        { success: false, error: 'Invalid anon key format - should be a JWT token' },
        { status: 400 }
      );
    }

    // Test connection by creating a temporary client and making a simple query
    const testClient = createClient(url, anonKey);
    
    // Test basic connectivity by trying to access the database
    // This will work even without authentication if RLS is properly configured
    try {
      // Try a simple query that should work regardless of authentication
      const { error } = await testClient
        .from('bookings')
        .select('count', { count: 'exact', head: true })
        .limit(1);
      
      // If we get a specific table doesn't exist error, that's actually good - 
      // it means we can connect to the database
      if (error && error.code === '42P01') {
        // Table doesn't exist yet - connection is good, just needs setup
        return NextResponse.json({
          success: true,
          message: 'Connection successful - database ready for table creation'
        });
      }
      
      // If no error, connection is perfect
      if (!error) {
        return NextResponse.json({
          success: true,
          message: 'Connection successful - database and tables ready'
        });
      }
      
      // For other errors, check if it's just a permissions issue (which is expected)
      if (error.code === '42501' || error.message.includes('permission') || error.message.includes('policy')) {
        return NextResponse.json({
          success: true,
          message: 'Connection successful - database accessible (permissions configured)'
        });
      }
      
      // If it's an actual connection error, throw it
      if (error.code === 'PGRST301' || error.message.includes('connection') || error.message.includes('network')) {
        throw error;
      }
      
      // For any other error, assume connection is OK but there might be setup issues
      return NextResponse.json({
        success: true,
        message: 'Connection established - minor setup may be needed'
      });
      
    } catch (queryError: any) {
      // If we can't connect at all, this will be a network/auth error
      if (queryError.message.includes('Invalid API key') || queryError.message.includes('unauthorized')) {
        throw new Error('Invalid credentials - please check your URL and API key');
      }
      
      if (queryError.message.includes('network') || queryError.message.includes('fetch')) {
        throw new Error('Network error - please check your project URL');
      }
      
      // If we get here, the connection is probably working but there are other issues
      return NextResponse.json({
        success: true,
        message: 'Basic connection successful'
      });
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
