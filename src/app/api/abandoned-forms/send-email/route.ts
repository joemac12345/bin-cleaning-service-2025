import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { abandonedBookingTemplate } from '@/lib/emailTemplates';
import { createBookingConfirmationEmail } from '@/lib/email-templates';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function POST(request: NextRequest) {
  try {
    const { formId, email, template, customerName, postcode, formData } = await request.json();

    if (!formId || !email || !template) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { success: false, error: 'Database configuration missing' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Generate email HTML based on template
    let emailHtml = '';
    let emailSubject = '';

    const sampleData = {
      customerName: customerName || 'Customer',
      customerEmail: email,
      bookingId: `BIN-${Date.now()}`,
      serviceType: 'Wheelie Bin Cleaning',
      collectionDay: 'TBD',
      address: formData?.address || '',
      postcode: postcode || '',
      totalPrice: 25.00,
      specialInstructions: '',
      phone: formData?.phone || '',
      contactPermission: 'yes'
    };

    switch (template) {
      case 'abandoned-booking':
        emailHtml = abandonedBookingTemplate(sampleData);
        emailSubject = 'Complete Your Bin Cleaning Booking';
        break;
      case 'booking-confirmation':
        emailHtml = createBookingConfirmationEmail({
          customerName: sampleData.customerName,
          customerEmail: sampleData.customerEmail,
          bookingId: sampleData.bookingId,
          serviceType: sampleData.serviceType,
          address: sampleData.address,
          postcode: sampleData.postcode,
          phone: sampleData.phone,
          contactPermission: sampleData.contactPermission
        });
        emailSubject = 'Booking Confirmation - Bin Cleaning Service';
        break;
      default:
        emailHtml = abandonedBookingTemplate(sampleData);
        emailSubject = 'Complete Your Bin Cleaning Booking';
    }

    // Generate unique tracking ID for email open tracking
    const trackingId = `${formId}-${Date.now()}`;

    // Add tracking pixel to email HTML (1x1 transparent image)
    const trackingPixel = `<img src="${process.env.NEXT_PUBLIC_SITE_URL || 'https://bin-cleaning-service.netlify.app'}/api/track-email-open?id=${trackingId}" width="1" height="1" alt="" style="display:block;width:1px;height:1px;" />`;
    const emailWithTracking = emailHtml.replace('</body>', `${trackingPixel}</body>`);

    // Send email via existing email API
    const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://bin-cleaning-service.netlify.app'}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'preview',
        to: email,
        subject: emailSubject,
        html: emailWithTracking,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      return NextResponse.json(
        { success: false, error: errorData.error || 'Failed to send email' },
        { status: 500 }
      );
    }

    // Fetch the form from database
    const { data: existingForm, error: fetchError } = await supabase
      .from('abandoned_forms')
      .select('*')
      .eq('form_id', formId)
      .single();

    if (fetchError || !existingForm) {
      return NextResponse.json(
        { success: false, error: 'Form not found' },
        { status: 404 }
      );
    }

    // Get existing contact history
    const formDataObj = existingForm.form_data || {};
    const contactHistory = formDataObj.contactHistory || [];

    // Add new email activity
    contactHistory.push({
      type: 'email',
      timestamp: new Date().toISOString(),
      details: `Sent ${template} template`,
      template: template,
      trackingId: trackingId,
      emailOpened: false
    });

    // Determine new status
    let newStatus = formDataObj.status || 'never_contacted';
    if (newStatus === 'never_contacted' || newStatus === 'abandoned') {
      newStatus = 'email_sent';
    } else if (contactHistory.length > 1) {
      newStatus = 'multiple_attempts';
    }

    // Update form in database
    const updatedFormData = {
      ...formDataObj,
      contactHistory: contactHistory,
      status: newStatus
    };

    const { error: updateError } = await supabase
      .from('abandoned_forms')
      .update({ form_data: updatedFormData })
      .eq('form_id', formId);

    if (updateError) {
      console.error('Error updating form:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to update form' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      trackingId: trackingId
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
