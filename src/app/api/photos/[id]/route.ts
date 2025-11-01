/**
 * INDIVIDUAL PHOTO API
 * 
 * Handles operations on specific photos:
 * - PUT: Update photo metadata (visibility, caption, etc.)
 * - DELETE: Remove photo from storage and database
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseStorage';

// PUT - Update photo metadata
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const updateData: any = {};
    
    if (body.isPublic !== undefined) {
      updateData.is_public = body.isPublic;
    }
    if (body.caption !== undefined) {
      updateData.caption = body.caption;
    }
    if (body.customerName !== undefined) {
      updateData.customer_name = body.customerName;
    }
    if (body.location !== undefined) {
      updateData.location = body.location;
    }

    const { data: photo, error } = await supabase
      .from('photos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      photo: {
        id: photo.id,
        url: photo.url,
        thumbnail: photo.thumbnail,
        caption: photo.caption,
        type: photo.type,
        customerName: photo.customer_name,
        location: photo.location,
        isPublic: photo.is_public,
        date: photo.created_at
      }
    });

  } catch (error) {
    console.error('Error updating photo:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update photo' 
    }, { status: 500 });
  }
}

// DELETE - Remove photo
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // First get the photo to find the file path
    const { data: photo, error: fetchError } = await supabase
      .from('photos')
      .select('file_path')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // Delete from storage
    if (photo.file_path) {
      const { error: storageError } = await supabase.storage
        .from('photos')
        .remove([photo.file_path]);

      if (storageError) {
        console.error('Storage deletion error:', storageError);
        // Continue with database deletion even if storage fails
      }
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('photos')
      .delete()
      .eq('id', id);

    if (dbError) throw dbError;

    return NextResponse.json({ 
      success: true, 
      message: 'Photo deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting photo:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete photo' 
    }, { status: 500 });
  }
}
