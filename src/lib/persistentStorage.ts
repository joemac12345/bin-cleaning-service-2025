// Simple persistent storage for Vercel serverless functions
import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const BOOKINGS_DB = path.join(DATA_DIR, 'bookings-db.json');

export class PersistentStorage {
  private static async ensureDirectory() {
    try {
      await fs.access(DATA_DIR);
    } catch {
      await fs.mkdir(DATA_DIR, { recursive: true });
    }
  }

  static async getBookings(): Promise<any[]> {
    try {
      await this.ensureDirectory();
      const data = await fs.readFile(BOOKINGS_DB, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      // Return empty array if file doesn't exist
      return [];
    }
  }

  static async saveBookings(bookings: any[]): Promise<void> {
    try {
      await this.ensureDirectory();
      await fs.writeFile(BOOKINGS_DB, JSON.stringify(bookings, null, 2));
    } catch (error) {
      console.error('Failed to save bookings:', error);
      throw error;
    }
  }

  static async addBooking(booking: any): Promise<void> {
    const bookings = await this.getBookings();
    bookings.push(booking);
    await this.saveBookings(bookings);
  }

  static async deleteBooking(bookingId: string): Promise<boolean> {
    const bookings = await this.getBookings();
    const filteredBookings = bookings.filter(b => b.bookingId !== bookingId);
    
    if (filteredBookings.length === bookings.length) {
      return false; // Booking not found
    }
    
    await this.saveBookings(filteredBookings);
    return true;
  }

  static async clearAll(): Promise<void> {
    await this.saveBookings([]);
  }
}
