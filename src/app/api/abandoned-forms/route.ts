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
    
    // Transform the data to match the expected frontend structure
    const transformedForms = (data || []).map(form => {
      const formData = form.form_data?.formData || form.form_data || {};
      const postcode = form.form_data?.postcode || '';
      const currentStep = form.form_data?.currentStep || 0;
      const status = form.form_data?.status || 'abandoned'; // Get status from form_data
      
      // Calculate completion percentage (assuming 6 total steps)
      const totalSteps = 6;
      const completionPercentage = Math.round((currentStep / totalSteps) * 100);
      
      // Calculate potential value based on bins
      const binQuantities = formData.binQuantities || {};
      const potentialValue = (
        (binQuantities.wheelie || 0) * 5 +
        (binQuantities.recycling || 0) * 5 +
        (binQuantities.food || 0) * 3 +
        (binQuantities.garden || 0) * 7
      );
      
      return {
        id: form.form_id || form.id,
        sessionId: form.form_id || form.id,
        postcode: postcode,
        formData: formData,
        createdAt: form.created_at || form.abandoned_at,
        lastUpdated: form.created_at || form.abandoned_at,
        status: status,
        completionPercentage: completionPercentage,
        potentialValue: potentialValue,
        contactInfo: {
          hasEmail: !!(formData.email && formData.email.trim()),
          hasPhone: !!(formData.phone && formData.phone.trim()),
          hasName: !!(formData.firstName || formData.lastName)
        },
        notes: form.form_data?.notes || ''
      };
    });
    
    return NextResponse.json({ 
      success: true,
      abandonedForms: transformedForms,
      count: transformedForms.length
    });
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Add new abandoned form
export async function POST(request: NextRequest) {
  try {
    console.log('📝 Saving abandoned form to database...');

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Database configuration missing' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const body = await request.json();

    // Check if form has any contact details (email, phone, or name)
    const formData = body.formData || {};
    const hasEmail = formData.email && formData.email.trim().length > 0;
    const hasPhone = formData.phone && formData.phone.trim().length > 0;
    const hasName = (formData.firstName && formData.firstName.trim().length > 0) || 
                    (formData.lastName && formData.lastName.trim().length > 0);

    // Only save if at least one contact method exists
    if (!hasEmail && !hasPhone && !hasName) {
      console.log('⏭️ Skipping abandoned form - no contact details provided');
      return NextResponse.json({
        success: true,
        message: 'Form not saved - no contact details',
        skipped: true
      });
    }

    // Generate form ID
    const formId = `AF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    console.log('📝 Abandoned form data:', {
      formId,
      hasFormData: !!body.formData,
      hasEmail,
      hasPhone,
      hasName,
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
      console.log('🧹 Starting to clear all abandoned forms...');
      
      const { error } = await supabase
        .from('abandoned_forms')
        .delete()
        .not('form_id', 'is', null); // Delete all rows where form_id is not null
        
      if (error) {
        console.error('❌ Failed to clear abandoned forms:', error);
        return NextResponse.json({ 
          error: 'Failed to clear abandoned forms',
          details: error.message 
        }, { status: 500 });
      }
      
      console.log('🧹 All abandoned forms cleared successfully');
      
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

// PATCH - Update abandoned form status
export async function PATCH(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Database configuration missing' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const body = await request.json();
    const { formId, status, notes } = body;

    if (!formId) {
      return NextResponse.json(
        { success: false, error: 'Missing form ID' },
        { status: 400 }
      );
    }

    console.log(`📝 Updating form ${formId} status to: ${status}`);

    // First, get the current form data
    const { data: currentForm, error: fetchError } = await supabase
      .from('abandoned_forms')
      .select('form_data')
      .eq('form_id', formId)
      .single();

    if (fetchError) {
      console.error('❌ Failed to fetch form:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch form' }, { status: 500 });
    }

    // Update the form_data with status
    const updatedFormData = {
      ...(currentForm.form_data || {}),
      status: status || 'abandoned',
      notes: notes || currentForm.form_data?.notes || ''
    };

    const { error } = await supabase
      .from('abandoned_forms')
      .update({ form_data: updatedFormData })
      .eq('form_id', formId);

    if (error) {
      console.error('❌ Failed to update form status:', error);
      return NextResponse.json({ error: 'Failed to update form status' }, { status: 500 });
    }

    console.log('✅ Form status updated successfully');

    return NextResponse.json({
      success: true,
      message: 'Form status updated successfully'
    });

  } catch (error) {
    console.error('Error updating form status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update form status' },
      { status: 500 }
    );
  }
}
