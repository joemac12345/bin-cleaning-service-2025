/**
 * POSTCODE CHECKER COMPONENT - Service Area Validation & Lead Capture
 * ==================================================================
 * 
 * REDESIGNED VERSION: Fun, Friendly, Branded UX
 * 
 * This is the CORE BUSINESS LOGIC component for your bin cleaning service.
 * It determines whether you can serve a customer and routes them accordingly.
 * 
 * NOW WITH:
 * - 🎨 Warm brand colors (orange, amber, emerald gradients)
 * - 🎉 Engaging emoji usage throughout
 * - 💬 Friendly, conversational copy
 * - ✨ Smooth animations and transitions
 * - 📱 Mobile-first responsive design
 * - 🎯 Clear visual hierarchy
 * 
 * Primary Functions:
 * - Validates customer postcodes against your service areas database
 * - Routes qualified customers to booking form (revenue generation)
 * - Captures leads from unserviced areas via waitlist (expansion planning)
 * - Provides auto-location detection for better user experience
 * - Displays current service areas to set customer expectations
 * 
 * Business Impact:
 * - REVENUE: Converts qualified leads to bookings
 * - EXPANSION: Tracks demand in new areas for business growth
 * - UX: Prevents frustrated customers from areas you don't serve yet
 * - EFFICIENCY: Pre-qualifies customers before they reach booking form
 */

'use client';

import { useState, useEffect } from 'react';
import { MapPin, CheckCircle, Clock, ArrowRight, Navigation, Zap } from 'lucide-react';
import { formatPostcode, extractPostcodeArea } from '@/components/postcode-manager/services/postcodeService';
import usePostcodeService from '@/components/postcode-manager/hooks/usePostcodeService';
import useInvalidPostcodeService from '@/components/postcode-manager/hooks/useInvalidPostcodeService';

// OFFLINE VALIDATION UTILITY
const isValidUKPostcodeFormat = (postcode: string): boolean => {
  const ukPostcodeRegex = /^[A-Z]{1,2}\d{1,2}\s?\d[A-Z]{2}$/;
  return ukPostcodeRegex.test(postcode.replace(/\s+/g, ' ').toUpperCase());
};

interface PostcodeCheckerProps {
  onServiceAvailable: (postcode: string) => void;
  onWaitlist: (postcode: string) => void;
}

export default function PostcodeChecker({ onServiceAvailable, onWaitlist }: PostcodeCheckerProps) {
  
  // STATE MANAGEMENT
  const [postcode, setPostcode] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<'available' | 'waitlist' | null>(null);
  const [error, setError] = useState('');
  const [typewriterText, setTypewriterText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isDetecting, setIsDetecting] = useState(false);
  
  const { activePostcodes } = usePostcodeService();
  const { trackInvalid } = useInvalidPostcodeService();

  // TYPEWRITER ANIMATION EFFECT
  useEffect(() => {
    const text = 'Enter your postcode';
    let index = 0;
    let isDeleting = false;
    
    const typeInterval = setInterval(() => {
      if (!isDeleting) {
        if (index <= text.length) {
          setTypewriterText(text.slice(0, index));
          index++;
        } else {
          setTimeout(() => {
            isDeleting = true;
          }, 2000);
        }
      } else {
        if (index > 0) {
          index--;
          setTypewriterText(text.slice(0, index));
        } else {
          isDeleting = false;
        }
      }
    }, isDeleting ? 50 : 100);

    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => {
      clearInterval(typeInterval);
      clearInterval(cursorInterval);
    };
  }, []);

  // CORE BUSINESS LOGIC
  const checkPostcode = async () => {
    if (!postcode.trim()) {
      setError('Please enter a postcode');
      return;
    }

    setIsChecking(true);
    setError('');

    try {
      console.log('🔍 Checking postcode:', postcode);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      const response = await fetch(`/api/postcodes?postcode=${encodeURIComponent(postcode)}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error('API response not ok:', response.status, response.statusText);
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Postcode API response:', data);
      
      const formattedPostcode = formatPostcode(postcode);

      if (data.isValid) {
        setResult('available');
        setTimeout(() => {
          onServiceAvailable(formattedPostcode);
        }, 2000);
      } else {
        const area = extractPostcodeArea(formattedPostcode);
        trackInvalid(formattedPostcode, area);
        setResult('waitlist');
        setTimeout(() => {
          onWaitlist(formattedPostcode);
        }, 1500);
      }

    } catch (error: any) {
      console.error('❌ Postcode validation error:', error);
      console.log('🔄 Attempting offline fallback validation...');
      
      const formattedPostcode = formatPostcode(postcode);
      
      if (!isValidUKPostcodeFormat(formattedPostcode)) {
        setError('Please enter a valid UK postcode (e.g., M1 1AA, SW1A 1AA)');
      } else {
        console.log('📝 Using offline fallback - valid format, adding to waitlist');
        
        const area = extractPostcodeArea(formattedPostcode);
        trackInvalid(formattedPostcode, area);
        
        setResult('waitlist');
        setTimeout(() => {
          onWaitlist(formattedPostcode);
        }, 1500);
      }
    }

    setIsChecking(false);
  };

  // AUTO-DETECTION FEATURE
  const autoDetectPostcode = async () => {
    if (!navigator.geolocation) {
      setError('Location services not available. Please type your postcode above.');
      return;
    }

    setIsDetecting(true);
    setError('');

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve, 
          (error) => {
            switch(error.code) {
              case error.PERMISSION_DENIED:
                reject(new Error('Location access denied. Please type your postcode above.'));
                break;
              case error.POSITION_UNAVAILABLE:
                reject(new Error('Location unavailable. Please type your postcode above.'));
                break;
              case error.TIMEOUT:
                reject(new Error('Location timeout. Please type your postcode above.'));
                break;
              default:
                reject(new Error('Location error. Please type your postcode above.'));
                break;
            }
          },
          {
            enableHighAccuracy: true,
            timeout: 8000,
            maximumAge: 60000
          }
        );
      });

      const { latitude, longitude } = position.coords;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&countrycodes=gb&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'BinCleaningApp/1.0'
          },
          signal: controller.signal
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Location service unavailable. Please type your postcode above.');
      }

      const data = await response.json();
      const detectedPostcode = data.address?.postcode;
      
      if (detectedPostcode) {
        setPostcode(detectedPostcode.toUpperCase());
        setError('');
      } else {
        throw new Error('No postcode found for your location. Please type your postcode above.');
      }

    } catch (error: any) {
      console.error('Location detection error:', error);
      
      if (error.name === 'AbortError') {
        setError('Location detection timed out. Please type your postcode above.');
      } else {
        setError(error.message || 'Auto-detection failed. Please type your postcode above.');
      }
    } finally {
      setIsDetecting(false);
    }
  };

  return (
    <div className="w-full">
      {result === null && (
        <div className="space-y-4">
          {/* Main Input */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Enter Postcode
            </label>
            <input
              id="postcode"
              type="text"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value.toUpperCase())}
              placeholder={typewriterText + (showCursor ? '|' : '')}
              className={`w-full px-4 py-3 bg-gray-50 border text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:outline-none text-base ${
                error ? 'border-red-600' : 'border-gray-300'
              }`}
              onKeyPress={(e) => e.key === 'Enter' && checkPostcode()}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-sm bg-red-50 border border-red-200 py-2 px-3">
              {error}
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={checkPostcode}
            disabled={isChecking || !postcode.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium py-3.5 px-6 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isChecking ? (
              <span className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Checking...
              </span>
            ) : (
              'Check Availability'
            )}
          </button>

          {/* Auto-detect Link */}
          <div className="text-center">
            <button
              onClick={autoDetectPostcode}
              disabled={isDetecting || isChecking}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {isDetecting ? 'Detecting location...' : 'Auto-detect my location'}
            </button>
          </div>

          {/* Current Service Areas */}
          {activePostcodes.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Current Service Areas
              </h3>
              <div className="flex flex-wrap gap-2">
                {activePostcodes.map((postcode) => (
                  <span
                    key={postcode}
                    className="px-3 py-1 bg-gray-100 border border-gray-300 text-gray-700 text-xs font-medium"
                  >
                    {postcode}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUCCESS STATE - Service Available */}
      {result === 'available' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 px-4 py-6">
            <div className="flex items-start gap-3 mb-3">
              <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Service Available
                </h3>
                <p className="text-sm text-gray-700">
                  We service <span className="font-semibold text-blue-600">{formatPostcode(postcode)}</span>
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-3">
              Redirecting to booking...
            </p>
          </div>
        </div>
      )}

      {/* WAITLIST STATE - Not Yet Available */}
      {result === 'waitlist' && (
        <div className="space-y-4">
          <div className="bg-gray-100 border border-gray-300 px-4 py-6">
            <div className="flex items-start gap-3 mb-3">
              <Clock className="w-6 h-6 text-gray-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Area Not Serviced
                </h3>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">{formatPostcode(postcode)}</span> is not currently available
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-3">
              Redirecting to waitlist...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

