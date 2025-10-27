// Global storage for Vercel serverless functions
// Using global variables that persist across function calls within the same instance

declare global {
  var __VERCEL_BOOKINGS__: any[] | undefined;
  var __VERCEL_BOOKINGS_INITIALIZED__: boolean | undefined;
  var __VERCEL_ABANDONED_FORMS__: any[] | undefined;
}

export const MemoryStorage = {
  async initialize() {
    if (!global.__VERCEL_BOOKINGS_INITIALIZED__) {
      // Initialize global storage with demo data only if completely empty
      if (!global.__VERCEL_BOOKINGS__) {
        global.__VERCEL_BOOKINGS__ = [
          {
            serviceType: "regular",
            customerInfo: {
              firstName: "Demo",
              lastName: "User", 
              email: "demo@example.com",
              phone: "07123456789",
              address: "Demo Address",
              postcode: "DE1 1MO"
            },
            binSelection: {
              wheelie: 1,
              food: 0,
              recycling: 0,
              garden: 0
            },
            collectionDay: "Monday",
            paymentMethod: "card",
            specialInstructions: "Demo booking for testing",
            pricing: {
              binTotal: 5,
              serviceCharge: 0,
              totalPrice: 5
            },
            bookingId: "BK-DEMO-123456",
            createdAt: "2025-10-26T21:00:00.000Z",
            status: "new-job"
          }
        ];
      }
      global.__VERCEL_BOOKINGS_INITIALIZED__ = true;
      console.log('📋 Global storage initialized, current count:', global.__VERCEL_BOOKINGS__.length);
    }
  },

  async getBookings(): Promise<any[]> {
    await this.initialize();
    return [...(global.__VERCEL_BOOKINGS__ || [])]; // Return a copy
  },

  async addBooking(booking: any): Promise<void> {
    await this.initialize();
    if (!global.__VERCEL_BOOKINGS__) {
      global.__VERCEL_BOOKINGS__ = [];
    }
    global.__VERCEL_BOOKINGS__.push(booking);
    console.log('📝 Added booking to global storage. Total:', global.__VERCEL_BOOKINGS__.length);
  },

  async saveBookings(bookings: any[]): Promise<void> {
    global.__VERCEL_BOOKINGS__ = [...bookings];
    console.log('💾 Saved bookings to global storage. Total:', global.__VERCEL_BOOKINGS__.length);
  },

  async deleteBooking(bookingId: string): Promise<boolean> {
    await this.initialize();
    if (!global.__VERCEL_BOOKINGS__) return false;
    
    const initialLength = global.__VERCEL_BOOKINGS__.length;
    global.__VERCEL_BOOKINGS__ = global.__VERCEL_BOOKINGS__.filter((b: any) => b.bookingId !== bookingId);
    return global.__VERCEL_BOOKINGS__.length < initialLength;
  },

  async clearAll(): Promise<void> {
    global.__VERCEL_BOOKINGS__ = [];
    console.log('🧹 Cleared all bookings from global storage');
  }
};

// Abandoned Forms Storage
export const AbandonedFormsStorage = {
  async getAbandonedForms(): Promise<any[]> {
    if (!global.__VERCEL_ABANDONED_FORMS__) {
      global.__VERCEL_ABANDONED_FORMS__ = [];
    }
    return [...global.__VERCEL_ABANDONED_FORMS__]; // Return a copy
  },

  async addAbandonedForm(form: any): Promise<void> {
    if (!global.__VERCEL_ABANDONED_FORMS__) {
      global.__VERCEL_ABANDONED_FORMS__ = [];
    }
    global.__VERCEL_ABANDONED_FORMS__.push(form);
    console.log('📝 Added abandoned form to global storage. Total:', global.__VERCEL_ABANDONED_FORMS__.length);
  },

  async deleteAbandonedForm(formId: string): Promise<boolean> {
    if (!global.__VERCEL_ABANDONED_FORMS__) return false;
    
    const initialLength = global.__VERCEL_ABANDONED_FORMS__.length;
    global.__VERCEL_ABANDONED_FORMS__ = global.__VERCEL_ABANDONED_FORMS__.filter((f: any) => f.id !== formId);
    return global.__VERCEL_ABANDONED_FORMS__.length < initialLength;
  },

  async clearAllAbandonedForms(): Promise<void> {
    global.__VERCEL_ABANDONED_FORMS__ = [];
    console.log('🧹 Cleared all abandoned forms from global storage');
  }
};
