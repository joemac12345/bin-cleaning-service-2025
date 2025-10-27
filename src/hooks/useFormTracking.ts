'use client';

import { useEffect, useRef, useCallback } from 'react';

interface FormData {
  [key: string]: any;
}

interface UseFormTrackingOptions {
  trackingId: string;
  onAbandon?: (formData: FormData) => void;
  debounceMs?: number;
}

export function useFormTracking({
  trackingId,
  onAbandon,
  debounceMs = 3000
}: UseFormTrackingOptions) {
  const formDataRef = useRef<FormData>({});
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSubmittedRef = useRef(false);
  const hasDataRef = useRef(false);

  // Track form data changes
  const trackFieldChange = useCallback((fieldName: string, value: any) => {
    if (isSubmittedRef.current) return;

    // Update form data
    formDataRef.current = {
      ...formDataRef.current,
      [fieldName]: value
    };

    // Mark that we have data
    if (value && value.toString().trim().length > 0) {
      hasDataRef.current = true;
    }

    console.log('📝 Form field tracked:', {
      field: fieldName,
      hasValue: !!value,
      totalFields: Object.keys(formDataRef.current).length
    });

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for abandonment tracking
    timeoutRef.current = setTimeout(() => {
      if (!isSubmittedRef.current && hasDataRef.current) {
        console.log('⏰ Form abandonment detected after timeout');
        saveAbandonedForm();
      }
    }, debounceMs);
  }, [debounceMs]);

  // Save abandoned form to database
  const saveAbandonedForm = useCallback(async () => {
    if (isSubmittedRef.current || !hasDataRef.current) return;

    try {
      console.log('💾 Saving abandoned form to database...');

      const response = await fetch('/api/abandoned-forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData: formDataRef.current,
          pageUrl: typeof window !== 'undefined' ? window.location.href : '',
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
          trackingId
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Abandoned form saved:', result.formId);
        
        // Call custom handler if provided
        if (onAbandon) {
          onAbandon(formDataRef.current);
        }
      } else {
        console.error('❌ Failed to save abandoned form:', response.statusText);
      }
    } catch (error) {
      console.error('💥 Error saving abandoned form:', error);
    }
  }, [trackingId, onAbandon]);

  // Mark form as submitted (prevents abandonment tracking)
  const markAsSubmitted = useCallback(() => {
    console.log('✅ Form marked as submitted - stopping abandonment tracking');
    isSubmittedRef.current = true;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  // Track page visibility changes (user switches tabs/closes page)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && !isSubmittedRef.current && hasDataRef.current) {
        console.log('👁️ Page hidden with form data - saving abandoned form');
        saveAbandonedForm();
      }
    };

    const handleBeforeUnload = () => {
      if (!isSubmittedRef.current && hasDataRef.current) {
        console.log('🚪 Page unload with form data - saving abandoned form');
        // Use sendBeacon for reliability during page unload
        if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
          navigator.sendBeacon('/api/abandoned-forms', JSON.stringify({
            formData: formDataRef.current,
            pageUrl: typeof window !== 'undefined' ? window.location.href : '',
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
            trackingId
          }));
        }
      }
    };

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }
    
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      }
      
      if (typeof window !== 'undefined') {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      }
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [saveAbandonedForm, trackingId]);

  return {
    trackFieldChange,
    markAsSubmitted,
    getCurrentFormData: () => formDataRef.current,
    hasData: () => hasDataRef.current
  };
}
