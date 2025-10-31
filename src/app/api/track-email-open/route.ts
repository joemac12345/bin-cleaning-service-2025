import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trackingId = searchParams.get('id');

    if (!trackingId) {
      // Return 1x1 transparent GIF anyway
      return new NextResponse(
        Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'),
        {
          headers: {
            'Content-Type': 'image/gif',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        }
      );
    }

    // Extract formId from trackingId
    const formId = trackingId.split('-')[0];

    // Read and update abandoned forms data
    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data: existingForm, error: fetchError } = await supabase
          .from('abandoned_forms')
          .select('*')
          .eq('form_id', formId)
          .single();

        if (!fetchError && existingForm) {
          const formDataObj = existingForm.form_data || {};
          const contactHistory = formDataObj.contactHistory || [];

          // Find the email with this tracking ID and mark as opened
          const emailActivity = contactHistory.find(
            (activity: any) => activity.trackingId === trackingId && activity.type === 'email'
          );

          if (emailActivity && !emailActivity.emailOpened) {
            emailActivity.emailOpened = true;
            emailActivity.openedAt = new Date().toISOString();

            // Update status to 'responded' if email was opened
            let newStatus = formDataObj.status;
            if (newStatus === 'email_sent') {
              newStatus = 'responded';
            }

            // Update form in database
            const updatedFormData = {
              ...formDataObj,
              contactHistory: contactHistory,
              status: newStatus
            };

            await supabase
              .from('abandoned_forms')
              .update({ form_data: updatedFormData })
              .eq('form_id', formId);
            
            console.log(`Email opened tracked for form ${formId}`);
          }
        }
      } catch (error) {
        console.error('Error tracking email open:', error);
        // Don't fail the request - still return the tracking pixel
      }
    }

    // Return 1x1 transparent GIF
    return new NextResponse(
      Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'),
      {
        headers: {
          'Content-Type': 'image/gif',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );

  } catch (error) {
    console.error('Error in email tracking:', error);
    
    // Always return a valid image even on error
    return new NextResponse(
      Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'),
      {
        headers: {
          'Content-Type': 'image/gif',
        },
      }
    );
  }
}
