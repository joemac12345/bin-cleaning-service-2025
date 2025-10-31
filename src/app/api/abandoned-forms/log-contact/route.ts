import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function POST(request: NextRequest) {
  try {
    const { formId, type, details } = await request.json();

    if (!formId || !type || !details) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { success: false, error: 'Database configuration missing' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch the form from database
    const { data: existingForm, error: fetchError } = await supabase
      .from('abandoned_forms')
      .select('*')
      .eq('form_id', formId)
      .single();

    if (fetchError || !existingForm) {
      return NextResponse.json(
        { success: false, error: 'Form not found' },
        { status: 404 }
      );
    }

    // Get existing contact history
    const formDataObj = existingForm.form_data || {};
    const contactHistory = formDataObj.contactHistory || [];

    // Add new contact activity
    contactHistory.push({
      type: type,
      timestamp: new Date().toISOString(),
      details: details,
      emailOpened: false
    });

    // Determine new status
    let newStatus = formDataObj.status || 'never_contacted';
    if (type === 'phone') {
      if (details.toLowerCase().includes('interested')) {
        newStatus = 'responded';
      } else if (newStatus === 'never_contacted' || newStatus === 'abandoned') {
        newStatus = 'phone_called';
      } else {
        newStatus = 'multiple_attempts';
      }
    }

    // Update form in database
    const updatedFormData = {
      ...formDataObj,
      contactHistory: contactHistory,
      status: newStatus
    };

    const { error: updateError } = await supabase
      .from('abandoned_forms')
      .update({ form_data: updatedFormData })
      .eq('form_id', formId);

    if (updateError) {
      console.error('Error updating form:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to update form' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Contact logged successfully'
    });

  } catch (error) {
    console.error('Error logging contact:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
