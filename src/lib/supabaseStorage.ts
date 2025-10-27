import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Create Supabase client (will work for build, needs real values for runtime)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database interface that matches your current memoryStorage
export const DatabaseStorage = {
  async initialize() {
    // No initialization needed - database is always ready!
    console.log('📋 Database storage ready');
  },

  async getBookings(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching bookings:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Database error:', error);
      return [];
    }
  },

  async addBooking(booking: any): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([{
          booking_id: booking.bookingId,
          service_type: booking.serviceType,
          customer_info: booking.customerInfo,
          bin_selection: booking.binSelection,
          collection_day: booking.collectionDay,
          payment_method: booking.paymentMethod,
          special_instructions: booking.specialInstructions,
          pricing: booking.pricing,
          status: booking.status || 'new-job',
          created_at: booking.createdAt
        }]);

      if (error) {
        console.error('Error adding booking:', error);
        throw error;
      }
      
      console.log('📝 Added booking to database:', booking.bookingId);
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  },

  async saveBookings(bookings: any[]): Promise<void> {
    // This method isn't needed with real database
    console.log('📝 Bookings are automatically saved in database');
  },

  async deleteBooking(bookingId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('booking_id', bookingId);

      if (error) {
        console.error('Error deleting booking:', error);
        return false;
      }
      
      console.log('🗑️ Deleted booking from database:', bookingId);
      return true;
    } catch (error) {
      console.error('Database error:', error);
      return false;
    }
  },

  async clearAll(): Promise<void> {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .neq('booking_id', ''); // Delete all records

      if (error) {
        console.error('Error clearing bookings:', error);
        throw error;
      }
      
      console.log('🧹 Cleared all bookings from database');
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }
};

// Abandoned Forms Storage
export const AbandonedFormsStorage = {
  async getAbandonedForms(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('abandoned_forms')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching abandoned forms:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Database error:', error);
      return [];
    }
  },

  async addAbandonedForm(form: any): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('abandoned_forms')
        .insert([{
          form_id: form.id,
          form_data: form.formData,
          abandoned_at: form.abandonedAt,
          page_url: form.pageUrl,
          user_agent: form.userAgent
        }]);

      if (error) {
        console.error('Error adding abandoned form:', error);
        throw error;
      }
      
      console.log('📝 Added abandoned form to database');
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  },

  async deleteAbandonedForm(formId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('abandoned_forms')
        .delete()
        .eq('form_id', formId);

      if (error) {
        console.error('Error deleting abandoned form:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Database error:', error);
      return false;
    }
  },

  async clearAllAbandonedForms(): Promise<void> {
    try {
      const { error } = await supabase
        .from('abandoned_forms')
        .delete()
        .neq('form_id', ''); // Delete all records

      if (error) {
        console.error('Error clearing abandoned forms:', error);
        throw error;
      }
      
      console.log('🧹 Cleared all abandoned forms from database');
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }
};

// Email functionality using Supabase Edge Functions
export const EmailService = {
  async sendBookingConfirmation(emailData: any): Promise<{ success: boolean; error?: string }> {
    try {
      // Use Supabase Edge Function for sending emails
      const { data, error } = await supabase.functions.invoke('send-booking-confirmation', {
        body: emailData
      });

      if (error) {
        console.error('Error sending booking confirmation:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Email service error:', error);
      return { success: false, error: error.message };
    }
  },

  async sendAdminNotification(emailData: any): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('send-admin-notification', {
        body: emailData
      });

      if (error) {
        console.error('Error sending admin notification:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Email service error:', error);
      return { success: false, error: error.message };
    }
  }
};
