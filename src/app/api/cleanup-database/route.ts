import { NextRequest, NextResponse } from 'next/server';
import { DatabaseStorage, AbandonedFormsStorage } from '@/lib/supabaseStorage';

// DELETE - Clean up all database data
export async function DELETE() {
  try {
    console.log('🧹 Starting database cleanup...');
    
    const results = {
      bookingsCleared: false,
      abandonedFormsCleared: false,
      errors: [] as string[]
    };

    // Clear bookings
    try {
      await DatabaseStorage.clearAll();
      results.bookingsCleared = true;
      console.log('✅ Bookings cleared from database');
    } catch (error: any) {
      results.errors.push(`Bookings cleanup failed: ${error.message}`);
      console.error('❌ Error clearing bookings:', error);
    }

    // Clear abandoned forms
    try {
      await AbandonedFormsStorage.clearAllAbandonedForms();
      results.abandonedFormsCleared = true;
      console.log('✅ Abandoned forms cleared from database');
    } catch (error: any) {
      results.errors.push(`Abandoned forms cleanup failed: ${error.message}`);
      console.error('❌ Error clearing abandoned forms:', error);
    }

    // Verify cleanup
    const remainingBookings = await DatabaseStorage.getBookings();
    const remainingForms = await AbandonedFormsStorage.getAbandonedForms();
    
    console.log('📊 Cleanup verification:');
    console.log(`   Remaining bookings: ${remainingBookings.length}`);
    console.log(`   Remaining forms: ${remainingForms.length}`);

    return NextResponse.json({
      success: results.errors.length === 0,
      message: results.errors.length === 0 
        ? 'Database cleanup completed successfully' 
        : 'Database cleanup completed with some errors',
      results,
      verification: {
        remainingBookings: remainingBookings.length,
        remainingForms: remainingForms.length
      }
    });

  } catch (error: any) {
    console.error('❌ Database cleanup failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database cleanup failed', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}
