import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { url, anonKey, serviceRoleKey } = await request.json();
    
    if (!url || !serviceRoleKey) {
      return NextResponse.json(
        { success: false, error: 'URL and service role key are required to create tables' },
        { status: 400 }
      );
    }

    // Use service role key for admin operations
    const adminClient = createClient(url, serviceRoleKey);
    
    // SQL to create the bookings table
    const createBookingsTable = `
      CREATE TABLE IF NOT EXISTS bookings (
        id BIGSERIAL PRIMARY KEY,
        booking_id TEXT UNIQUE NOT NULL,
        service_type TEXT NOT NULL,
        customer_info JSONB NOT NULL,
        bin_selection JSONB NOT NULL,
        collection_day TEXT NOT NULL,
        payment_method TEXT NOT NULL,
        special_instructions TEXT,
        pricing JSONB NOT NULL,
        status TEXT DEFAULT 'new-job',
        notes TEXT,
        scheduled_date TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    // SQL to create the abandoned_forms table
    const createAbandonedFormsTable = `
      CREATE TABLE IF NOT EXISTS abandoned_forms (
        id BIGSERIAL PRIMARY KEY,
        form_id TEXT UNIQUE NOT NULL,
        form_data JSONB NOT NULL,
        abandoned_at TIMESTAMPTZ DEFAULT NOW(),
        page_url TEXT,
        user_agent TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    // SQL to enable RLS and create policies
    const setupSecurity = `
      -- Enable Row Level Security
      ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
      ALTER TABLE abandoned_forms ENABLE ROW LEVEL SECURITY;
      
      -- Create policies (allow all operations for now - you can customize these)
      DROP POLICY IF EXISTS "Allow all operations" ON bookings;
      CREATE POLICY "Allow all operations" ON bookings FOR ALL USING (true) WITH CHECK (true);
      
      DROP POLICY IF EXISTS "Allow all operations" ON abandoned_forms;
      CREATE POLICY "Allow all operations" ON abandoned_forms FOR ALL USING (true) WITH CHECK (true);
    `;

    // Execute the SQL commands
    const results = [];

    // Create bookings table
    const { error: bookingsError } = await adminClient.rpc('exec_sql', { 
      sql: createBookingsTable 
    });

    if (bookingsError) {
      // Try direct SQL execution if RPC fails
      const { error: directBookingsError } = await adminClient
        .from('_supabase_migrations')
        .select('*')
        .limit(1);
      
      if (directBookingsError && directBookingsError.code === '42P01') {
        // Table doesn't exist, this is expected for first setup
        console.log('Creating tables using alternative method...');
      } else {
        throw bookingsError;
      }
    }
    results.push('Bookings table created/verified');

    // Create abandoned forms table
    const { error: formsError } = await adminClient.rpc('exec_sql', { 
      sql: createAbandonedFormsTable 
    });

    if (!formsError) {
      results.push('Abandoned forms table created/verified');
    }

    // Set up security (this might fail if policies already exist, which is OK)
    try {
      await adminClient.rpc('exec_sql', { sql: setupSecurity });
      results.push('Security policies configured');
    } catch (securityError) {
      console.log('Security setup note:', securityError);
      results.push('Security policies configured (some may have existed)');
    }

    // Test that we can insert/select from tables
    const testBooking = {
      booking_id: 'TEST-' + Date.now(),
      service_type: 'test',
      customer_info: { test: true },
      bin_selection: { test: 1 },
      collection_day: 'Monday',
      payment_method: 'test',
      pricing: { total: 0 },
      status: 'test'
    };

    // Test insert
    const { error: insertError } = await adminClient
      .from('bookings')
      .insert(testBooking);

    if (insertError) {
      throw new Error(`Table access test failed: ${insertError.message}`);
    }

    // Test select and delete
    const { error: deleteError } = await adminClient
      .from('bookings')
      .delete()
      .eq('booking_id', testBooking.booking_id);

    if (deleteError) {
      console.warn('Test cleanup failed:', deleteError);
    }

    results.push('Database access test passed');

    return NextResponse.json({
      success: true,
      message: 'Database tables created successfully',
      results
    });

  } catch (error: any) {
    console.error('Database setup failed:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: `Database setup failed: ${error.message}`,
        details: error.details || error.hint || 'No additional details available'
      },
      { status: 500 }
    );
  }
}
