import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// GET - Fetch all waitlist entries (for admin)
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Fetching waitlist entries from database...');

    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Missing Supabase credentials');
      return NextResponse.json({ error: 'Database configuration missing' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { data, error } = await supabase
      .from('waitlist')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Database error:', error);
      return NextResponse.json({ error: 'Failed to fetch waitlist entries' }, { status: 500 });
    }

    console.log(`✅ Found ${data?.length || 0} waitlist entries in database`);
    
    // Calculate stats
    const stats = {
      total: data?.length || 0,
      pending: data?.filter((e: any) => e.status === 'pending').length || 0,
      contacted: data?.filter((e: any) => e.status === 'contacted').length || 0,
      converted: data?.filter((e: any) => e.status === 'converted').length || 0
    };

    return NextResponse.json({ 
      success: true,
      entries: data || [],
      stats
    });

  } catch (error) {
    console.error('Error fetching waitlist:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch waitlist' },
      { status: 500 }
    );
  }
}

// POST - Add new waitlist entry
export async function POST(request: NextRequest) {
  try {
    console.log('📝 Saving waitlist entry to database...');

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Database configuration missing' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const body = await request.json();

    // Generate entry ID
    const entryId = `WL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    console.log('📝 Waitlist entry data:', {
      entryId,
      name: body.name,
      email: body.email,
      postcode: body.postcode
    });

    const { data, error } = await supabase
      .from('waitlist')
      .insert([{
        entry_id: entryId,
        name: body.name || '',
        email: body.email || '',
        postcode: body.postcode || '',
        status: 'pending',
        created_at: new Date().toISOString()
      }])
      .select();

    if (error) {
      console.error('❌ Database insert error:', error);
      return NextResponse.json({ error: 'Failed to save waitlist entry' }, { status: 500 });
    }
    
    console.log('✅ Waitlist entry saved successfully:', entryId);

    return NextResponse.json({
      success: true,
      message: 'Waitlist entry saved successfully',
      entryId
    });

  } catch (error) {
    console.error('Error saving waitlist entry:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save waitlist entry' },
      { status: 500 }
    );
  }
}

// PATCH - Update waitlist entry status
export async function PATCH(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Database configuration missing' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const body = await request.json();
    const { entryId, status, notes } = body;

    if (!entryId) {
      return NextResponse.json({ error: 'Entry ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const { data, error } = await supabase
      .from('waitlist')
      .update(updateData)
      .eq('entry_id', entryId)
      .select();

    if (error) {
      console.error('❌ Failed to update waitlist entry:', error);
      return NextResponse.json({ error: 'Failed to update waitlist entry' }, { status: 500 });
    }

    console.log('✅ Waitlist entry updated:', entryId);

    return NextResponse.json({
      success: true,
      message: 'Waitlist entry updated successfully',
      entry: data?.[0]
    });

  } catch (error) {
    console.error('Error updating waitlist entry:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update waitlist entry' },
      { status: 500 }
    );
  }
}

// DELETE - Delete waitlist entry
export async function DELETE(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Database configuration missing' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { searchParams } = new URL(request.url);
    const entryId = searchParams.get('entryId');
    
    if (!entryId) {
      return NextResponse.json({ error: 'Entry ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('waitlist')
      .delete()
      .eq('entry_id', entryId);

    if (error) {
      console.error('❌ Failed to delete waitlist entry:', error);
      return NextResponse.json({ error: 'Failed to delete waitlist entry' }, { status: 500 });
    }

    console.log('🗑️ Waitlist entry deleted:', entryId);

    return NextResponse.json({
      success: true,
      message: 'Waitlist entry deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting waitlist entry:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete waitlist entry' },
      { status: 500 }
    );
  }
}
