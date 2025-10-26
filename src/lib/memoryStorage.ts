// Memory-based storage for Vercel (since file system is read-only)
// This will persist for the duration of a single serverless function instance

let memoryBookings: any[] = [];
let initialized = false;

export const MemoryStorage = {
  async initialize() {
    if (!initialized) {
      // Load initial demo data
      memoryBookings = [
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
      initialized = true;
      console.log('📋 Memory storage initialized with demo data');
    }
  },

  async getBookings(): Promise<any[]> {
    await this.initialize();
    return [...memoryBookings]; // Return a copy
  },

  async addBooking(booking: any): Promise<void> {
    await this.initialize();
    memoryBookings.push(booking);
    console.log('📝 Added booking to memory storage. Total:', memoryBookings.length);
  },

  async saveBookings(bookings: any[]): Promise<void> {
    memoryBookings = [...bookings];
    console.log('💾 Saved bookings to memory storage. Total:', memoryBookings.length);
  },

  async deleteBooking(bookingId: string): Promise<boolean> {
    await this.initialize();
    const initialLength = memoryBookings.length;
    memoryBookings = memoryBookings.filter(b => b.bookingId !== bookingId);
    return memoryBookings.length < initialLength;
  },

  async clearAll(): Promise<void> {
    memoryBookings = [];
    console.log('🧹 Cleared all bookings from memory storage');
  }
};
