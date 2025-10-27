import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// GET - Fetch all abandoned forms (for admin)
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Fetching abandoned forms from database...');

    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Missing Supabase credentials');
      return NextResponse.json({ error: 'Database configuration missing' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { data, error } = await supabase
      .from('abandoned_forms')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Database error:', error);
      return NextResponse.json({ error: 'Failed to fetch abandoned forms' }, { status: 500 });
    }

    console.log(`✅ Found ${data?.length || 0} abandoned forms in database`);
    
    return NextResponse.json({ 
      success: true,
      abandonedForms: data || [],
      count: data?.length || 0
    });
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Add new abandoned form
export async function POST(request: NextRequest) {
  try {
    console.log('� Saving abandoned form to database...');

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Database configuration missing' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const body = await request.json();

    // Generate form ID
    const formId = `AF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    console.log('📝 Abandoned form data:', {
      formId,
      hasFormData: !!body.formData,
      pageUrl: body.pageUrl,
      fieldsCompleted: body.formData ? Object.keys(body.formData).length : 0
    });

    const { data, error } = await supabase
      .from('abandoned_forms')
      .insert([{
        form_id: formId,
        form_data: body.formData || {},
        page_url: body.pageUrl || '',
        user_agent: body.userAgent || '',
        abandoned_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      }])
      .select();

    if (error) {
      console.error('❌ Database insert error:', error);
      return NextResponse.json({ error: 'Failed to save abandoned form' }, { status: 500 });
    }
    
    console.log('✅ Abandoned form saved successfully:', formId);

    return NextResponse.json({
      success: true,
      message: 'Abandoned form saved successfully',
      formId
    });

  } catch (error) {
    console.error('Error saving abandoned form:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save abandoned form' },
      { status: 500 }
    );
  }
}

// DELETE - Delete abandoned form or clear all
export async function DELETE(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Database configuration missing' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { searchParams } = new URL(request.url);
    const formId = searchParams.get('formId');
    const clearAll = searchParams.get('clearAll');
    
    // Special endpoint to clear all data
    if (clearAll === 'true') {
      const { error } = await supabase
        .from('abandoned_forms')
        .delete()
        .neq('id', ''); // Delete all rows
        
      if (error) {
        console.error('❌ Failed to clear abandoned forms:', error);
        return NextResponse.json({ error: 'Failed to clear abandoned forms' }, { status: 500 });
      }
      
      console.log('🧹 All abandoned forms cleared');
      
      return NextResponse.json({
        success: true,
        message: 'All abandoned forms cleared successfully'
      });
    }
    
    // Delete specific form
    if (!formId) {
      return NextResponse.json(
        { success: false, error: 'Missing form ID' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('abandoned_forms')
      .delete()
      .eq('form_id', formId);
    
    if (error) {
      console.error('❌ Failed to delete abandoned form:', error);
      return NextResponse.json({ error: 'Failed to delete abandoned form' }, { status: 500 });
    }
    
    console.log('🗑️ Abandoned form deleted:', formId);
    
    return NextResponse.json({
      success: true,
      message: 'Abandoned form deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting abandoned form:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete abandoned form' },
      { status: 500 }
    );
  }
}
