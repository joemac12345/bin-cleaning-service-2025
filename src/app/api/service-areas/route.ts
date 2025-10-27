import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Add new service area
export async function POST(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Database configuration missing' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { postcode, areaName } = await request.json();

    if (!postcode) {
      return NextResponse.json(
        { error: 'Postcode required' },
        { status: 400 }
      );
    }

    // Extract postcode area (e.g., "M1" from "M1 1AA")
    const cleanPostcode = postcode.replace(/\s+/g, '').toUpperCase();
    const postcodeArea = cleanPostcode.match(/^([A-Z]{1,2}\d{1,2})/)?.[1] || cleanPostcode;
    const postcodePrefix = postcodeArea.match(/^([A-Z]+)/)?.[1] || '';

    console.log('➕ Adding service area:', { postcode: cleanPostcode, area: postcodeArea, prefix: postcodePrefix });
    
    // Add new service area
    const { data, error } = await supabase
      .from('service_areas')
      .insert([{
        postcode: postcodeArea,
        postcode_prefix: postcodePrefix,
        area_name: areaName || `${postcodeArea} Area`,
        is_active: true
      }])
      .select()
      .single();

    if (error) {
      // Check if it's a duplicate key error
      if (error.code === '23505') {
        return NextResponse.json(
          { error: `Postcode area ${postcodeArea} already exists in service areas` },
          { status: 409 }
        );
      }
      
      console.error('Database insert error:', error);
      return NextResponse.json(
        { error: 'Failed to add service area' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      serviceArea: data,
      message: `Postcode area ${postcodeArea} added to service areas`
    });

  } catch (error) {
    console.error('Add service area error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update service area status
export async function PUT(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Database configuration missing' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { id, isActive } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Service area ID required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('service_areas')
      .update({ 
        is_active: isActive,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Database update error:', error);
      return NextResponse.json(
        { error: 'Failed to update service area' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      serviceArea: data,
      message: `Service area ${isActive ? 'activated' : 'deactivated'}`
    });

  } catch (error) {
    console.error('Update service area error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete service area
export async function DELETE(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Database configuration missing' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Service area ID required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('service_areas')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Database delete error:', error);
      return NextResponse.json(
        { error: 'Failed to delete service area' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Service area deleted successfully'
    });

  } catch (error) {
    console.error('Delete service area error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
