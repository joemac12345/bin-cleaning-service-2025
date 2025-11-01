/**
 * PHOTOS API ENDPOINT
 * 
 * Handles photo operations:
 * - GET: Fetch all photos for gallery
 * - POST: Upload new photo with metadata
 * - PUT: Update photo details
 * - DELETE: Remove photo from database
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseStorage';
import { randomUUID } from 'crypto';

// GET - Fetch photos for gallery
export async function GET() {
  try {
    console.log('📸 GET /api/photos - Fetching photos from database');
    
    const { data: photos, error } = await supabase
      .from('photos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Database error:', error);
      throw error;
    }

    console.log(`✅ Found ${photos?.length || 0} photos in database`);
    if (photos && photos.length > 0) {
      console.log('📋 Photos:', photos.map(p => ({ id: p.id, caption: p.caption, created_at: p.created_at })));
    }

    return NextResponse.json({ 
      success: true, 
      photos: photos || [] 
    });
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch photos',
      details: error 
    }, { status: 500 });
  }
}

// POST - Upload new photo
export async function POST(request: NextRequest) {
  try {
    console.log('Photo upload request received');
    
    // Test Supabase connection first
    console.log('Testing Supabase connection...');
    const { data: testData, error: testError } = await supabase
      .from('photos')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('Supabase connection test failed:', testError);
      return NextResponse.json({ 
        success: false, 
        error: 'Database connection failed',
        details: testError
      }, { status: 500 });
    }
    console.log('Supabase connection successful');
    
    const formData = await request.formData();
    
    const photoFile = formData.get('photo') as File;
    const caption = formData.get('caption') as string;
    const type = formData.get('type') as string;
    const customerName = formData.get('customerName') as string;
    const location = formData.get('location') as string;
    const isPublic = formData.get('isPublic') === 'true';
    const mediaType = formData.get('media_type') as string || 'image';

    console.log('Form data:', { 
      hasFile: !!photoFile,
      fileName: photoFile?.name,
      fileSize: `${((photoFile?.size || 0) / 1024 / 1024).toFixed(1)}MB`,
      fileType: photoFile?.type,
      caption, 
      type, 
      customerName, 
      location, 
      isPublic,
      mediaType 
    });

    if (!photoFile) {
      console.log('No photo file provided');
      return NextResponse.json({ 
        success: false, 
        error: 'No photo provided' 
      }, { status: 400 });
    }

    if (!caption || !type) {
      console.log('Missing required fields:', { caption, type });
      return NextResponse.json({ 
        success: false, 
        error: 'Caption and type are required' 
      }, { status: 400 });
    }

    // Generate unique filename
    const fileExt = photoFile.name.split('.').pop();
    const fileName = `${randomUUID()}.${fileExt}`;
    const filePath = `photos/${fileName}`;

    // Convert File to ArrayBuffer for Supabase
    const arrayBuffer = await photoFile.arrayBuffer();
    const fileBuffer = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    console.log('Uploading to Supabase storage:', filePath);
    const { error: uploadError } = await supabase.storage
      .from('photos')
      .upload(filePath, fileBuffer, {
        contentType: photoFile.type,
        upsert: false
      });

    if (uploadError) {
      console.error('Supabase storage upload error:', uploadError);
      throw uploadError;
    }
    console.log('File uploaded successfully to storage');

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('photos')
      .getPublicUrl(filePath);

    // Save photo metadata to database
    const photoData = {
      id: randomUUID(),
      url: publicUrl,
      thumbnail: publicUrl, // You could generate thumbnails here
      caption,
      type,
      customer_name: customerName || null,
      location: location || null,
      is_public: isPublic,
      media_type: mediaType,
      created_at: new Date().toISOString(),
      file_path: filePath
    };

    console.log('Inserting photo data to database:', photoData);
    const { data: photo, error: dbError } = await supabase
      .from('photos')
      .insert(photoData)
      .select()
      .single();

    if (dbError) {
      console.error('Database insert error:', dbError);
      throw dbError;
    }
    console.log('Photo saved to database successfully:', photo);

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
    console.error('Error uploading photo:', error);
    
    // Provide more specific error details
    let errorMessage = 'Failed to upload photo';
    let errorDetails = {};
    
    if (error && typeof error === 'object') {
      if ('message' in error) {
        errorMessage = error.message as string;
      }
      errorDetails = { ...error };
    }
    
    console.error('Detailed error:', { errorMessage, errorDetails });
    
    return NextResponse.json({ 
      success: false, 
      error: errorMessage,
      details: errorDetails
    }, { status: 500 });
  }
}
