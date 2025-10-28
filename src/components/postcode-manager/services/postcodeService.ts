// Postcode validation and management service
export interface ServiceArea {
  id: string;
  postcode: string;
  area: string;
  isActive: boolean;
  dateAdded: string;
}

const STORAGE_KEY = 'bin-cleaning-service-areas';

// Load from localStorage if available, otherwise empty array
const loadServiceAreas = (): ServiceArea[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('Loaded service areas from localStorage:', parsed);
      return parsed;
    }
  } catch (error) {
    console.error('Error loading service areas from localStorage:', error);
  }
  
  return [];
};

// Save to localStorage
const saveServiceAreas = (areas: ServiceArea[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(areas));
    console.log('Saved service areas to localStorage:', areas);
  } catch (error) {
    console.error('Error saving service areas to localStorage:', error);
  }
};

// This would normally connect to your database
let serviceAreas: ServiceArea[] = loadServiceAreas();

// Initialize service areas from localStorage or empty array
export const initializeServiceAreas = () => {
  serviceAreas = loadServiceAreas();
  console.log('Initialized service areas:', serviceAreas);
};

export const getAreaName = (postcode: string) => {
  const areaMap: { [key: string]: string } = {
    'SW': 'South West London',
    'SE': 'South East London',
    'N': 'North London',
    'E': 'East London',
    'W': 'West London',
    'NW': 'North West London',
    'M': 'Manchester',
    'B': 'Birmingham'
  };
  
  const prefix = postcode.match(/^[A-Z]+/)?.[0] || '';
  return areaMap[prefix] || 'Unknown Area';
};

export const formatPostcode = (input: string) => {
  const cleaned = input.replace(/\s/g, '').toUpperCase();
  if (cleaned.length > 3) {
    return cleaned.slice(0, -3) + ' ' + cleaned.slice(-3);
  }
  return cleaned;
};

export const extractPostcodeArea = (postcode: string) => {
  const cleaned = postcode.replace(/\s/g, '').toUpperCase();
  const match = cleaned.match(/^([A-Z]{1,2}\d{1,2})/);
  return match ? match[1] : '';
};

// Validate postcode using UK postcodes API with fallback to basic format validation
export const validatePostcode = async (postcode: string): Promise<boolean> => {
  const formattedPostcode = formatPostcode(postcode);
  
  // Basic UK postcode format validation as fallback
  const basicValidation = (pc: string) => {
    const ukPostcodeRegex = /^[A-Z]{1,2}\d{1,2}\s?\d[A-Z]{2}$/;
    return ukPostcodeRegex.test(pc.replace(/\s+/g, ' '));
  };

  // If the postcode doesn't match basic UK format, reject immediately
  if (!basicValidation(formattedPostcode)) {
    console.log('❌ Postcode failed basic format validation:', formattedPostcode);
    return false;
  }

  try {
    console.log('🔍 Validating postcode with API:', formattedPostcode);
    
    // Try the postcodes.io API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(
      `https://api.postcodes.io/postcodes/${encodeURIComponent(formattedPostcode)}`,
      { 
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        }
      }
    );
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.warn('⚠️ API validation failed, using basic validation for:', formattedPostcode);
      return basicValidation(formattedPostcode);
    }
    
    const data = await response.json();
    const isValid = data.status === 200;
    
    console.log(`✅ Postcode ${formattedPostcode} API validation:`, isValid);
    return isValid;
    
  } catch (error: any) {
    console.warn('⚠️ Postcode API error, falling back to basic validation:', error.message);
    
    // If API fails (network issues, CORS, etc.), use basic format validation
    const isBasicValid = basicValidation(formattedPostcode);
    console.log(`📝 Basic validation result for ${formattedPostcode}:`, isBasicValid);
    
    return isBasicValid;
  }
};

// Get all active service postcodes
export const getActiveServicePostcodes = (): string[] => {
  // Always reload from localStorage to ensure fresh data
  serviceAreas = loadServiceAreas();
  
  if (serviceAreas.length === 0) {
    initializeServiceAreas();
  }
  
  const activePostcodes = serviceAreas.filter(sa => sa.isActive).map(sa => sa.postcode);
  console.log('Service - Total service areas:', serviceAreas.length);
  console.log('Service - Active postcodes:', activePostcodes);
  return activePostcodes;
};

// Check if a postcode area is served
export const isPostcodeServed = (postcode: string): boolean => {
  const area = extractPostcodeArea(postcode);
  const activePostcodes = getActiveServicePostcodes();
  return activePostcodes.includes(area);
};

// Add new service area
export const addServiceArea = (postcode: string, customAreaName?: string): ServiceArea | null => {
  const area = extractPostcodeArea(postcode);
  
  if (!area) {
    return null;
  }

  // Check if area already exists (by postcode, not just ID)
  const existingArea = serviceAreas.find(sa => sa.postcode === area);
  if (existingArea) {
    console.log(`Service area ${area} already exists`);
    return null;
  }

  // Generate a more unique ID using timestamp + random number
  const uniqueId = `area-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const newServiceArea: ServiceArea = {
    id: uniqueId,
    postcode: area,
    area: customAreaName?.trim() || getAreaName(area),
    isActive: true,
    dateAdded: new Date().toISOString().split('T')[0]
  };

  serviceAreas.push(newServiceArea);
  saveServiceAreas(serviceAreas);
  console.log(`Added service area ${area} with ID ${uniqueId}`);
  return newServiceArea;
};

// Get all service areas
export const getAllServiceAreas = (): ServiceArea[] => {
  // Always reload from localStorage to ensure fresh data
  serviceAreas = loadServiceAreas();
  
  if (serviceAreas.length === 0) {
    initializeServiceAreas();
  }
  // Always remove duplicates when getting areas
  removeDuplicates();
  return serviceAreas;
};

// Update service area status
export const updateServiceAreaStatus = (id: string, isActive: boolean): boolean => {
  const area = serviceAreas.find(sa => sa.id === id);
  if (area) {
    area.isActive = isActive;
    saveServiceAreas(serviceAreas);
    return true;
  }
  return false;
};

// Remove service area
export const removeServiceArea = (id: string): boolean => {
  const index = serviceAreas.findIndex(sa => sa.id === id);
  if (index !== -1) {
    serviceAreas.splice(index, 1);
    saveServiceAreas(serviceAreas);
    return true;
  }
  return false;
};

// Remove duplicates from service areas
export const removeDuplicates = (): void => {
  const seen = new Set<string>();
  const originalLength = serviceAreas.length;
  serviceAreas = serviceAreas.filter(area => {
    if (seen.has(area.postcode)) {
      return false;
    }
    seen.add(area.postcode);
    return true;
  });
  
  // Save if duplicates were removed
  if (serviceAreas.length !== originalLength) {
    saveServiceAreas(serviceAreas);
    console.log(`Removed ${originalLength - serviceAreas.length} duplicate areas`);
  }
};
