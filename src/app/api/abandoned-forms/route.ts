import { NextRequest, NextResponse } from 'next/server';
import { AbandonedFormsStorage } from '@/lib/supabaseStorage';

// GET - Fetch all abandoned forms (for admin)
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET /api/abandoned-forms called');
    
    const abandonedForms = await AbandonedFormsStorage.getAbandonedForms();
    console.log(`📊 Retrieved ${abandonedForms.length} abandoned forms`);
    
    return NextResponse.json({
      success: true,
      abandonedForms,
      count: abandonedForms.length
    });
    
  } catch (error) {
    console.error('Error fetching abandoned forms:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch abandoned forms' },
      { status: 500 }
    );
  }
}

// POST - Add new abandoned form
export async function POST(request: NextRequest) {
  try {
    console.log('📝 POST /api/abandoned-forms called');
    
    const formData = await request.json();
    console.log('📋 Abandoned form data:', formData);

    // Create abandoned form record
    const abandonedForm = {
      id: `AF-${Date.now()}-${Math.random().toString(36).substring(2)}`,
      formData,
      abandonedAt: new Date().toISOString(),
      pageUrl: formData.pageUrl || '',
      userAgent: formData.userAgent || ''
    };

    await AbandonedFormsStorage.addAbandonedForm(abandonedForm);
    
    console.log('✅ Abandoned form saved:', abandonedForm.id);

    return NextResponse.json({
      success: true,
      message: 'Abandoned form saved successfully',
      formId: abandonedForm.id
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
    const { searchParams } = new URL(request.url);
    const formId = searchParams.get('formId');
    const clearAll = searchParams.get('clearAll');
    
    // Special endpoint to clear all data
    if (clearAll === 'true') {
      await AbandonedFormsStorage.clearAllAbandonedForms();
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

    const deleteSuccess = await AbandonedFormsStorage.deleteAbandonedForm(formId);
    
    if (!deleteSuccess) {
      return NextResponse.json(
        { success: false, error: 'Abandoned form not found' },
        { status: 404 }
      );
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
