'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAllServiceAreas, getActiveServicePostcodes, type ServiceArea } from '../services/postcodeService';

// Custom hook for managing postcode service state
const usePostcodeService = () => {
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);
  const [activePostcodes, setActivePostcodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Refresh data from service
  const refresh = useCallback(() => {
    console.log('Refreshing postcode service data...');
    setIsLoading(true);
    
    try {
      const areas = getAllServiceAreas();
      const postcodes = getActiveServicePostcodes();
      
      setServiceAreas(areas);
      setActivePostcodes(postcodes);
      
      console.log('Hook - Refreshed areas:', areas.length);
      console.log('Hook - Refreshed postcodes:', postcodes);
    } catch (error) {
      console.error('Error refreshing postcode service:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Listen for localStorage changes (cross-tab sync)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'bin-cleaning-service-areas') {
        console.log('localStorage changed, refreshing...');
        refresh();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refresh]);

  return {
    serviceAreas,
    activePostcodes,
    isLoading,
    refresh
  };
};

export default usePostcodeService;
