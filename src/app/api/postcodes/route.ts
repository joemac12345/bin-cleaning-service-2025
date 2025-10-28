import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function GET(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Database configuration missing' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { searchParams } = new URL(request.url);
    const postcode = searchParams.get('postcode');

    if (!postcode) {
      return NextResponse.json(
        { error: 'Postcode parameter required' },
        { status: 400 }
      );
    }

    // Clean and format postcode
    const cleanPostcode = postcode.replace(/\s+/g, '').toUpperCase();
    const postcodeArea = cleanPostcode.match(/^([A-Z]{1,2}\d{1,2})/)?.[1] || cleanPostcode;
    
    console.log('🔍 Checking postcode:', cleanPostcode, 'Area:', postcodeArea);

    // Check if postcode area is in service areas
    const { data, error } = await supabase
      .from('service_areas')
      .select('*')
      .eq('postcode', postcodeArea)
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Database query failed' },
        { status: 500 }
      );
    }

    const isValid = !!data;
    
    return NextResponse.json(
      {
        postcode: cleanPostcode,
        postcodeArea: postcodeArea,
        isValid,
        serviceArea: data?.area_name || null,
        message: isValid 
          ? `Great! We service ${cleanPostcode}` 
          : `Sorry, we don't currently service ${cleanPostcode}`
      },
      {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );

  } catch (error: any) {
    console.error('❌ Postcode validation error:', error);
    
    // Get postcode from search params for error response
    const { searchParams } = new URL(request.url);
    const requestedPostcode = searchParams.get('postcode');
    
    // Return a more helpful error response
    const errorMessage = error.message?.includes('fetch') 
      ? 'Database connection error'
      : 'Postcode validation temporarily unavailable';
    
    return NextResponse.json(
      { 
        error: errorMessage,
        postcode: requestedPostcode?.replace(/\s+/g, '').toUpperCase() || '',
        isValid: false,
        message: 'Service temporarily unavailable. Please try again later.'
      },
      { status: 500 }
    );
  }
}

// GET all service areas
export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    if (action === 'get-all') {
      if (!supabaseUrl || !supabaseKey) {
        return NextResponse.json(
          { error: 'Database configuration missing' },
          { status: 500 }
        );
      }

      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const { data, error } = await supabase
        .from('service_areas')
        .select('*')
        .order('postcode', { ascending: true });

      if (error) {
        console.error('Database error:', error);
        return NextResponse.json(
          { error: 'Failed to fetch service areas' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        serviceAreas: data || [],
        total: data?.length || 0
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Service areas API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
