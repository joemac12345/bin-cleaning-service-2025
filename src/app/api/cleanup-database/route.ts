import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { sharedStorage } from '@/lib/sharedStorage';

// Database cleanup utility
export async function DELETE(request: NextRequest) {
  try {
    console.log('🧹 Starting AGGRESSIVE database cleanup...');
    
    // Clear all storage layers
    const results = {
      fileSystemCleared: false,
      sharedStorageCleared: false,
      abandonedFormsCleared: false,
      globalVariableCleared: false,
      errors: [] as string[]
    };

    // 1. Clear bookings from file system
    try {
      const bookingsFile = path.join(process.cwd(), 'data', 'bookings.json');
      await fs.writeFile(bookingsFile, JSON.stringify([], null, 2));
      results.fileSystemCleared = true;
      console.log('✅ File system bookings cleared');
    } catch (error) {
      results.errors.push(`File system: ${error}`);
      console.log('⚠️ File system clear failed (expected in Vercel)');
    }

    // 2. Clear shared storage bookings AGGRESSIVELY
    try {
      sharedStorage.setBookings([]);
      
      // Force clear the global variable directly
      if (global.__VERCEL_STORAGE__) {
        global.__VERCEL_STORAGE__.bookings = [];
        global.__VERCEL_STORAGE__.abandonedForms = [];
        results.globalVariableCleared = true;
      }
      
      // Double-check by re-initializing
      global.__VERCEL_STORAGE__ = {
        bookings: [],
        abandonedForms: []
      };
      
      results.sharedStorageCleared = true;
      console.log('✅ Shared storage AGGRESSIVELY cleared');
    } catch (error) {
      results.errors.push(`Shared storage: ${error}`);
    }

    // 3. Clear abandoned forms
    try {
      sharedStorage.setAbandonedForms([]);
      results.abandonedFormsCleared = true;
      console.log('✅ Abandoned forms cleared');
    } catch (error) {
      results.errors.push(`Abandoned forms: ${error}`);
    }

    // 4. Force garbage collection if available
    if (global.gc) {
      global.gc();
      console.log('✅ Garbage collection triggered');
    }

    // 5. Verify cleanup
    const remainingBookings = sharedStorage.getBookings();
    const remainingForms = sharedStorage.getAbandonedForms();
    
    console.log('🔍 Verification:', {
      bookingsRemaining: remainingBookings.length,
      formsRemaining: remainingForms.length
    });

    console.log('🎉 AGGRESSIVE database cleanup complete!');

    return NextResponse.json({
      success: true,
      message: 'Database AGGRESSIVELY cleared',
      details: results,
      verification: {
        bookingsRemaining: remainingBookings.length,
        formsRemaining: remainingForms.length
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Database cleanup failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Database cleanup failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
