import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * POST /api/postcodes/check
 * 
 * Check if a postcode is in a serviced area
 * Expected body: { postcode: string }
 * Returns: { available: boolean, postcode: string, area?: string, message: string }
 */
export async function POST(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Database configuration missing', available: false },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { postcode } = body;

    if (!postcode) {
      return NextResponse.json(
        { error: 'Postcode required', available: false },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Clean and format postcode
    const cleanPostcode = postcode.replace(/\s+/g, '').toUpperCase();
    const postcodeArea = cleanPostcode.match(/^([A-Z]{1,2}\d{1,2})/)?.[1] || cleanPostcode;
    
    console.log('🔍 Checking postcode availability:', cleanPostcode, 'Area:', postcodeArea);

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
        { 
          error: 'Database query failed', 
          available: false,
          postcode: cleanPostcode,
          message: 'Service temporarily unavailable. Please try again later.'
        },
        { status: 500 }
      );
    }

    const available = !!data;
    
    console.log(available ? '✅ Service available' : '❌ Service not available', 'for', cleanPostcode);

    return NextResponse.json(
      {
        available,
        postcode: cleanPostcode,
        area: data?.area_name || null,
        message: available 
          ? `Great! We service ${cleanPostcode}${data?.area_name ? ` (${data.area_name})` : ''}`
          : `Sorry, we don't currently service ${cleanPostcode}. Join our waitlist!`
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
    console.error('❌ Postcode check error:', error);
    
    return NextResponse.json(
      { 
        error: 'Postcode validation failed',
        available: false,
        postcode: '',
        message: 'Service temporarily unavailable. Please try again later.'
      },
      { status: 500 }
    );
  }
}
