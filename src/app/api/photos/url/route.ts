/**
 * VIDEO URL API ENDPOINT
 * 
 * Handles video URL uploads from social media platforms:
 * - POST: Save video URL with metadata (no file storage)
 * - Supports YouTube, TikTok, Instagram, Facebook
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseStorage';
import { randomUUID } from 'crypto';

// POST - Save video URL
export async function POST(request: NextRequest) {
  try {
    console.log('Video URL upload request received');
    
    const data = await request.json();
    
    console.log('Video URL data:', data);

    const {
      url,
      thumbnail,
      caption,
      type,
      customerName,
      location,
      isPublic,
      media_type,
      platform,
      video_id
    } = data;

    if (!url || !caption || !type) {
      console.log('Missing required fields:', { url, caption, type });
      return NextResponse.json({ 
        success: false, 
        error: 'URL, caption and type are required' 
      }, { status: 400 });
    }

    // Only allow YouTube videos (including Shorts)
    if (platform !== 'youtube' && !(url.includes('youtube.com') || url.includes('youtu.be'))) {
      console.log('Non-YouTube video rejected:', { url, platform });
      return NextResponse.json({ 
        success: false, 
        error: 'Only YouTube videos are supported. Please provide a valid YouTube URL.' 
      }, { status: 400 });
    }

    // Save video metadata to database (no file storage)
    const videoData = {
      id: randomUUID(),
      url: url,
      thumbnail: thumbnail || url, // Use provided thumbnail or fallback to URL
      caption,
      type,
      customer_name: customerName || null,
      location: location || null,
      is_public: isPublic,
      media_type: media_type || 'video',
      platform: platform || 'unknown',
      video_id: video_id || null,
      created_at: new Date().toISOString(),
      file_path: null // No file path for URL-based videos
    };

    console.log('Inserting video URL data to database:', videoData);
    const { data: video, error: dbError } = await supabase
      .from('photos')
      .insert([videoData])
      .select()
      .single();

    if (dbError) {
      console.error('Database insert error:', dbError);
      throw dbError;
    }

    console.log('Video URL saved successfully:', video);

    // Convert database format to UI format
    const uiVideo = {
      id: video.id,
      url: video.url,
      thumbnail: video.thumbnail,
      caption: video.caption,
      type: video.type,
      customerName: video.customer_name,
      location: video.location,
      date: video.created_at,
      isPublic: video.is_public,
      mediaType: video.media_type,
      platform: video.platform,
      videoId: video.video_id
    };

    return NextResponse.json({ 
      success: true, 
      photo: uiVideo // Keep consistent naming with file upload
    });

  } catch (error) {
    console.error('Video URL upload error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to save video URL',
      details: error 
    }, { status: 500 });
  }
}
