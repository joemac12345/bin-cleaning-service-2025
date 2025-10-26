'use client';

import { useState, useEffect } from 'react';
import { InvalidPostcodeStats, InvalidPostcodeEntry, invalidPostcodeService } from '../services/invalidPostcodeService';

export default function useInvalidPostcodeService() {
  const [invalidPostcodes, setInvalidPostcodes] = useState<InvalidPostcodeStats>({});
  
  // Load initial data
  useEffect(() => {
    const loadInitialData = () => {
      const data = invalidPostcodeService.getInvalidPostcodes();
      setInvalidPostcodes(data);
    };
    
    loadInitialData();
  }, []);

  // Listen for cross-tab updates
  useEffect(() => {
    const handleUpdate = (event: CustomEvent) => {
      setInvalidPostcodes(event.detail);
    };

    window.addEventListener('invalidPostcodeUpdate', handleUpdate as EventListener);
    
    return () => {
      window.removeEventListener('invalidPostcodeUpdate', handleUpdate as EventListener);
    };
  }, []);

  const trackInvalid = (postcode: string, area: string) => {
    invalidPostcodeService.trackInvalidPostcode(postcode, area);
  };

  const getByDemand = (): InvalidPostcodeEntry[] => {
    return invalidPostcodeService.getByDemand();
  };

  const clearAll = () => {
    invalidPostcodeService.clearAll();
  };

  const removeArea = (area: string) => {
    invalidPostcodeService.removeArea(area);
  };

  const refresh = () => {
    setInvalidPostcodes(invalidPostcodeService.getInvalidPostcodes());
  };

  return {
    invalidPostcodes,
    trackInvalid,
    getByDemand,
    clearAll,
    removeArea,
    refresh
  };
}
