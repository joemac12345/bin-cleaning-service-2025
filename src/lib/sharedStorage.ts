// Shared memory storage for Vercel serverless functions
// This provides a simple in-memory fallback when file system isn't available

interface StorageData {
  bookings: any[];
  abandonedForms: any[];
}

// Global storage that persists across function calls within the same instance
declare global {
  var __VERCEL_STORAGE__: StorageData | undefined;
}

// Initialize global storage if it doesn't exist
if (!global.__VERCEL_STORAGE__) {
  global.__VERCEL_STORAGE__ = {
    bookings: [],
    abandonedForms: []
  };
}

export const sharedStorage = {
  // Bookings methods
  getBookings: (): any[] => {
    return global.__VERCEL_STORAGE__?.bookings || [];
  },
  
  setBookings: (bookings: any[]): void => {
    if (global.__VERCEL_STORAGE__) {
      global.__VERCEL_STORAGE__.bookings = bookings;
    }
  },
  
  addBooking: (booking: any): void => {
    if (global.__VERCEL_STORAGE__) {
      global.__VERCEL_STORAGE__.bookings.push(booking);
    }
  },
  
  // Abandoned forms methods
  getAbandonedForms: (): any[] => {
    return global.__VERCEL_STORAGE__?.abandonedForms || [];
  },
  
  setAbandonedForms: (forms: any[]): void => {
    if (global.__VERCEL_STORAGE__) {
      global.__VERCEL_STORAGE__.abandonedForms = forms;
    }
  },
  
  addAbandonedForm: (form: any): void => {
    if (global.__VERCEL_STORAGE__) {
      global.__VERCEL_STORAGE__.abandonedForms.push(form);
    }
  }
};
