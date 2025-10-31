import { NextRequest, NextResponse } from 'next/server';

/**
 * Reverse Geocode API - Convert coordinates to UK postcode
 * Uses Nominatim (OpenStreetMap) API for free reverse geocoding
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (!lat || !lon) {
      return NextResponse.json(
        { error: 'Latitude and longitude parameters required' },
        { status: 400 }
      );
    }

    // Validate coordinates are in UK bounds
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (isNaN(latitude) || isNaN(longitude)) {
      return NextResponse.json(
        { error: 'Invalid coordinates' },
        { status: 400 }
      );
    }

    // UK bounds check: Lat 49-61, Lon -8-2
    if (latitude < 49 || latitude > 61 || longitude < -8 || longitude > 2) {
      return NextResponse.json(
        { 
          error: 'Location outside UK',
          message: 'We only service locations in the United Kingdom'
        },
        { status: 400 }
      );
    }

    console.log('🌍 Reverse geocoding:', { lat: latitude, lon: longitude });

    // Use Nominatim API (free OpenStreetMap service)
    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1&accept-language=en`;
    
    const response = await fetch(nominatimUrl, {
      headers: {
        'User-Agent': 'BinCleaningService/1.0', // Required by Nominatim
      },
    });

    if (!response.ok) {
      throw new Error(`Geocoding service error: ${response.status}`);
    }

    const data = await response.json();

    // Extract postcode from address
    const postcode = data.address?.postcode;

    if (!postcode) {
      return NextResponse.json(
        { 
          error: 'No postcode found',
          message: 'Unable to determine postcode for this location. Please enter manually.',
          address: data.display_name || null
        },
        { status: 404 }
      );
    }

    // Clean and format postcode
    const cleanPostcode = postcode.replace(/\s+/g, '').toUpperCase();
    const formattedPostcode = cleanPostcode.replace(/^([A-Z]{1,2}\d{1,2})(\d[A-Z]{2})$/, '$1 $2');

    console.log('✅ Found postcode:', formattedPostcode);

    return NextResponse.json(
      {
        postcode: formattedPostcode,
        rawPostcode: postcode,
        location: {
          lat: latitude,
          lon: longitude,
        },
        address: {
          display: data.display_name,
          city: data.address?.city || data.address?.town || data.address?.village,
          county: data.address?.county,
          country: data.address?.country,
        }
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        }
      }
    );

  } catch (error: any) {
    console.error('❌ Reverse geocoding error:', error);
    
    return NextResponse.json(
      { 
        error: 'Geocoding failed',
        message: 'Unable to determine location. Please enter postcode manually.',
        details: error.message
      },
      { status: 500 }
    );
  }
}
