'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAllServiceAreas, getActiveServicePostcodes, type ServiceArea } from '../services/postcodeService';

// Custom hook for managing postcode service state
const usePostcodeService = () => {
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);
  const [activePostcodes, setActivePostcodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Refresh data from database
  const refresh = useCallback(async () => {
    console.log('Refreshing postcode service data from database...');
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/postcodes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        body: JSON.stringify({ action: 'get-all', timestamp: Date.now() }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const areas = data.serviceAreas || [];
      const postcodes = areas.filter((area: any) => area.is_active).map((area: any) => area.postcode);
      
      // Convert database format to component format
      const formattedAreas = areas.map((area: any) => ({
        id: area.id,
        postcode: area.postcode,
        area: area.area_name,
        isActive: area.is_active,
        dateAdded: area.created_at?.split('T')[0] || new Date().toISOString().split('T')[0]
      }));
      
      setServiceAreas(formattedAreas);
      setActivePostcodes(postcodes);
      
      console.log('🔍 DEBUG - Database response:', data);
      console.log('🔍 DEBUG - Total areas from DB:', areas.length);
      console.log('🔍 DEBUG - Active areas from DB:', postcodes);
      console.log('🔍 DEBUG - User agent:', typeof window !== 'undefined' ? navigator.userAgent : 'server');
      console.log('🔍 DEBUG - Screen width:', typeof window !== 'undefined' ? window.innerWidth : 'server');
    } catch (error) {
      console.error('Error refreshing postcode service from database:', error);
      // Fallback to localStorage if database fails
      try {
        const areas = getAllServiceAreas();
        const postcodes = getActiveServicePostcodes();
        setServiceAreas(areas);
        setActivePostcodes(postcodes);
        console.log('🚨 FALLBACK - Using localStorage data instead of database');
        console.log('🚨 FALLBACK - localStorage areas:', areas);
        console.log('🚨 FALLBACK - localStorage postcodes:', postcodes);
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    // Force clear localStorage to ensure we always use database data
    if (typeof window !== 'undefined') {
      console.log('🧹 Clearing localStorage to force database fetch');
      localStorage.removeItem('bin-cleaning-service-areas');
    }
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
