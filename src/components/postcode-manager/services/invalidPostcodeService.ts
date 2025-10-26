export interface InvalidPostcodeEntry {
  postcode: string;
  area: string;
  timestamp: string;
  count: number;
}

export interface InvalidPostcodeStats {
  [area: string]: InvalidPostcodeEntry;
}

const STORAGE_KEY = 'invalidPostcodes';

export const invalidPostcodeService = {
  // Track an invalid postcode attempt
  trackInvalidPostcode: (postcode: string, area: string): void => {
    try {
      const existing = invalidPostcodeService.getInvalidPostcodes();
      const now = new Date().toISOString();
      
      if (existing[area]) {
        // Update existing entry
        existing[area] = {
          ...existing[area],
          count: existing[area].count + 1,
          timestamp: now, // Update to latest attempt
          postcode: postcode // Update to latest postcode format
        };
      } else {
        // Create new entry
        existing[area] = {
          postcode,
          area,
          timestamp: now,
          count: 1
        };
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      
      // Dispatch custom event for cross-tab sync
      window.dispatchEvent(new CustomEvent('invalidPostcodeUpdate', { 
        detail: existing 
      }));
    } catch (error) {
      console.error('Failed to track invalid postcode:', error);
    }
  },

  // Get all invalid postcode stats
  getInvalidPostcodes: (): InvalidPostcodeStats => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Failed to load invalid postcodes:', error);
      return {};
    }
  },

  // Get sorted list by demand (count)
  getByDemand: (): InvalidPostcodeEntry[] => {
    const stats = invalidPostcodeService.getInvalidPostcodes();
    return Object.values(stats).sort((a, b) => b.count - a.count);
  },

  // Clear all invalid postcode data
  clearAll: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('invalidPostcodeUpdate', { 
        detail: {} 
      }));
    } catch (error) {
      console.error('Failed to clear invalid postcodes:', error);
    }
  },

  // Remove specific area
  removeArea: (area: string): void => {
    try {
      const existing = invalidPostcodeService.getInvalidPostcodes();
      delete existing[area];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      
      window.dispatchEvent(new CustomEvent('invalidPostcodeUpdate', { 
        detail: existing 
      }));
    } catch (error) {
      console.error('Failed to remove invalid postcode area:', error);
    }
  }
};
