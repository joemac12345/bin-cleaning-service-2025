import { NextRequest, NextResponse } from 'next/server';
import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const envVars = await request.json();

    if (!envVars || typeof envVars !== 'object') {
      return NextResponse.json({
        success: false,
        error: 'Invalid environment variables format'
      }, { status: 400 });
    }

    // In development, update the .env.local file
    if (process.env.NODE_ENV === 'development') {
      try {
        const envPath = join(process.cwd(), '.env.local');
        
        // Read existing .env.local
        let existingEnv = '';
        try {
          existingEnv = readFileSync(envPath, 'utf8');
        } catch {
          // File doesn't exist, that's fine
        }

        // Parse existing variables
        const existingVars: Record<string, string> = {};
        existingEnv.split('\n').forEach(line => {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith('#')) {
            const [key, ...valueParts] = trimmed.split('=');
            if (key && valueParts.length > 0) {
              existingVars[key.trim()] = valueParts.join('=').trim();
            }
          }
        });

        // Merge with new variables
        const mergedVars = { ...existingVars, ...envVars };

        // Generate new .env.local content
        const newEnvContent = `# Supabase Configuration
# Get these values from your Supabase project dashboard

# Your Supabase project URL (found in Settings > General > Configuration)
NEXT_PUBLIC_SUPABASE_URL=${mergedVars.NEXT_PUBLIC_SUPABASE_URL || ''}

# Your Supabase anon/public key (found in Settings > General > Configuration) 
NEXT_PUBLIC_SUPABASE_ANON_KEY=${mergedVars.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}

# Optional: Supabase service role key (for admin operations)
# Only add this if you need admin-level database access
# SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Resend Email Configuration
# Get your API key from resend.com after signing up
RESEND_API_KEY=${mergedVars.RESEND_API_KEY || ''}
RESEND_FROM_EMAIL=${mergedVars.RESEND_FROM_EMAIL || 'onboarding@resend.dev'}
ADMIN_EMAIL=${mergedVars.ADMIN_EMAIL || ''}

# Application Configuration
NEXT_PUBLIC_BASE_URL=${mergedVars.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}
`;

        writeFileSync(envPath, newEnvContent, 'utf8');

        // Update runtime environment for the current process
        Object.entries(envVars).forEach(([key, value]) => {
          if (typeof value === 'string') {
            process.env[key] = value;
          }
        });

        return NextResponse.json({
          success: true,
          message: 'Environment variables updated successfully',
          updated: Object.keys(envVars)
        });

      } catch (error: any) {
        console.error('Error updating .env.local:', error);
        return NextResponse.json({
          success: false,
          error: 'Failed to update .env.local file'
        }, { status: 500 });
      }
    } else {
      // In production, we can't modify files, so just acknowledge the request
      return NextResponse.json({
        success: true,
        message: 'Configuration received. For production deployment, add these variables to your hosting platform.',
        note: 'Environment variables cannot be updated at runtime in production'
      });
    }

  } catch (error: any) {
    console.error('Update env error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to update environment variables'
    }, { status: 500 });
  }
}
